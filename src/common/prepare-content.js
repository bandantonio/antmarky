const ejs = require('ejs');
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs/promises');
const path = require('path');
const { md } = require('./md-parser');
const {
  findMdFilesSchema,
  filesContentSchema,
  convertMdToHtmlSchema,
  saveHtmlContentSchemaFile,
  saveHtmlContentSchemaContent,
  compileTemplateSchemaTemplatesPath,
  compileTemplateSchemaTemplate,
  removeOutputDirectorySchema,
  buildStaticFilesSchema,
  copyStaticAssetsSchema
} = require('../schemas/schemas');
const { embedRemoteMarkdown } = require('./embed-remote-markdown');
const checkForChildrenFolders = require('../helpers/checkForChildrenFolders');
const getMarkdownFiles = require('../helpers/getMarkdownFiles');
const { buildToc } = require('../toc');
const { errorPage } = require('../data/defaults');

/**
 * Find all Markdown files within the specified directory
 */
const findMdFiles = async (docsDirectoryName = 'docs') => {
  await findMdFilesSchema.validateAsync(docsDirectoryName).catch(() => {
    throw new Error('Invalid docs directory');
  });

  const docsDirectoryPath = path.join(process.cwd() + `/${docsDirectoryName}`);

  if (!fs.existsSync(docsDirectoryPath)) {
    throw new Error('The specified directory does not exist');
  }

  const resultingFilesTree = [];

  // Find all the Markdown files in the documentation directory and keep track of the child hierarchy
  const markdownFilesFilder = async (dir = docsDirectoryPath) => {
    // dirLevel is used to calculate hierarchy and children
    // 0 - docsDirectoryName, 1 - child dir for docsDirectoryName, etc
    // dirLevel is calculated via relative path
    const relativePath = path.relative(docsDirectoryPath, dir);
    const dirLevel = (relativePath === '') ? 0 : relativePath.split('/').length;

    // Class for the directory that is used to group files on the current hierarchical level (the 'last' directory in the path)
    const dirClass = (relativePath === '') ? 'home' : relativePath.substring(relativePath.lastIndexOf('/') + 1, relativePath.length);

    // Title case for the directory of the same dirClass
    const dirName = dirClass[0].toUpperCase() + dirClass.substring(1, dirClass.length);

    // Directory traversal logic
    const markdownFilesInFolder = getMarkdownFiles(dir);

    if (markdownFilesInFolder.length > 0) {
      resultingFilesTree.push({
        dirLevel: dirLevel,
        basePath: docsDirectoryPath,
        dirPath: relativePath,
        dirClass: dirClass,
        dirName: dirName,
        files: markdownFilesInFolder
      });
    }

    const anyFolderInside = checkForChildrenFolders(dir);
    if (anyFolderInside.length !== 0) {
      for (const directory of anyFolderInside) {
        await markdownFilesFilder(path.join(dir, directory));
      }
    }

    return resultingFilesTree;
  };
  const mdFiles = await markdownFilesFilder();
  return mdFiles;
};

/**
 * Get content of Markdown files
 */
const getFilesContent = async (fileDetails) => {
  try {
    await filesContentSchema.validateAsync(fileDetails);
  } catch (error) {
    throw new Error('Can\'t get content from Markdown files');
  }

  const mdFileContent = [];
  for (const details of fileDetails) {
    const absolutePath = path.join(details.basePath, details.dirPath);
    details.files.forEach(file => {
      const content = fs.readFileSync(path.join(absolutePath, `${file}.md`), { encoding: 'utf-8' });
      mdFileContent.push({
        name: file,
        title: file,
        content: content
      });
    });
  }
  return mdFileContent;
};

/**
 * Convert Markdown files to HTML
 */
const convertMdToHtml = (mdTextArray) => {
  const validation = convertMdToHtmlSchema.validate(mdTextArray);

  if (validation.error) {
    throw new Error('Can\'t convert. Input data is invalid');
  }
  return mdTextArray.map(mdText => {
    const html = md.makeHtml(mdText.content);
    const tableOfCOntents = buildToc(html);
    return {
      name: mdText.name,
      title: mdText.title,
      html,
      toc: tableOfCOntents
    };
  });
};

/**
 * Save HTML content to a file
 */
const saveHtmlContent = async (filename, htmlContent) => {
  try {
    await saveHtmlContentSchemaFile.validateAsync(filename);
    await saveHtmlContentSchemaContent.validateAsync(htmlContent);
  } catch (error) {
    throw Error(`Can't retrieve content to save html file(s). Something went wrong: ${error.message}`);
  }

  try {
    const basePath = path.join(process.cwd(), 'public');
    await fsp.mkdir(basePath, { recursive: true });
    await fsp.writeFile(path.join(basePath, filename), htmlContent);
  } catch (error) {
    throw Error(`Can't save html file(s). Something went wrong: ${error.message}`);
  }
};

/**
 * Wrapper function to find Markdown files and convert content to HTML
 * Returns an object containing two arrays:
 * - an array of objects with hierarchy of all pages
 * - an array of objects with all pages and corresponding HTML content
 */
const buildContent = async (docsDirectoryName = 'docs') => {
  const locatedMdFiles = await findMdFiles(docsDirectoryName);
  const allPages = locatedMdFiles;
  const mdFilesContent = await getFilesContent(locatedMdFiles);
  const mdFilesWithRemoteContent = await embedRemoteMarkdown(mdFilesContent);
  const htmlContent = convertMdToHtml(mdFilesWithRemoteContent);
  return {
    allPages: allPages,
    htmlContent: htmlContent
  };
};

/**
 * Compile EJS partials into a working template
 */
const compileTemplate = (templatesPath, template) => {
  const validateTemplatesPath = compileTemplateSchemaTemplatesPath.validate(templatesPath);
  const validateTemplate = compileTemplateSchemaTemplate.validate(template);

  if (validateTemplatesPath.error || validateTemplate.error) {
    throw Error('Error occurred when compiling template');
  }

  const compiledTemplate = ejs.compile(fs.readFileSync(templatesPath + '/' + template, 'utf-8'), {
    encoding: 'utf-8',
    views: [path.resolve(templatesPath)]
  });
  return compiledTemplate;
};

/**
 * Remove output directory before generating files
 */
const removeOutputDirectory = (outputDirectory = 'public') => {
  const validateOutputDirectory = removeOutputDirectorySchema.validate(outputDirectory);

  if (validateOutputDirectory.error) {
    throw Error(`Error occurred when deleting the output directory: ${validateOutputDirectory.error.message}`);
  }
  fse.emptyDirSync(path.resolve(outputDirectory));
};

/**
 * Copy source and docs assets to the corresponding directories
 */
const copyStaticAssets = (staticFolder = 'assets', docsDirectoryName = 'docs') => {
  const validateStaticAssets = copyStaticAssetsSchema.validate(staticFolder);

  if (validateStaticAssets.error) {
    throw Error(`Error occurred when copying static assets: ${validateStaticAssets.error.message}`);
  }
  fse.copySync(path.resolve(path.join(process.cwd() + '/src/' + staticFolder)), path.resolve('public'));

  const docsStaticFolderPath = path.join(path.resolve('public'), staticFolder);

  if (fs.existsSync(docsStaticFolderPath)) {
    fse.copySync(path.resolve(path.join(process.cwd() + `/${docsDirectoryName}/` + staticFolder)), docsStaticFolderPath);
  }
};

/**
 * Do the magic :)
 */
const buildStaticFiles = async (docsDirectoryName = 'docs') => {
  try {
    await buildStaticFilesSchema.validateAsync(docsDirectoryName);
  } catch (error) {
    throw new Error('Error when building static files');
  }
  removeOutputDirectory();
  const templatesPath = path.join(process.cwd() + '/views');
  const generatedContent = await buildContent(docsDirectoryName);
  const sidebarListOfPages = generatedContent.allPages.filter(page => page.name !== 'README');

  const items = await fsp.readdir(templatesPath);
  items.filter(item => path.extname(item) === '.ejs').forEach(async template => {
    if (template === 'page.ejs') {
      const compiledTemplate = compileTemplate(templatesPath, template);
      const pageContent = generatedContent.htmlContent.filter(content => content.name !== 'README');
      pageContent.forEach(async page => {
        const readyHtml = compiledTemplate({
          name: page.name,
          title: page.title,
          content: page.html,
          toc: page.toc,
          pages: sidebarListOfPages
        });
        await saveHtmlContent(`${page.name}.html`, readyHtml);
      });
    } else if (template === 'index.ejs') {
      const compiledTemplate = compileTemplate(templatesPath, template);
      const indexPage = generatedContent.htmlContent.find(content => content.name === 'README');
      if (indexPage) {
        const readyHtml = compiledTemplate({
          name: indexPage.name,
          title: indexPage.title,
          content: indexPage.html,
          pages: sidebarListOfPages
        });
        await saveHtmlContent('index.html', readyHtml);
      } else {
        const compiledTemplate = compileTemplate(templatesPath, template);
        const readyHtml = compiledTemplate({
          name: '/',
          title: 'Home',
          content: md.makeHtml(fs.readFileSync(path.resolve('README.md'), 'utf-8')),
          pages: sidebarListOfPages
        });
        await saveHtmlContent('index.html', readyHtml);
      }
    } else if (template === '404.ejs') {
      const compiledTemplate = compileTemplate(templatesPath, template);
      const readyHtml = compiledTemplate({
        name: '404',
        text: errorPage.text,
        title: errorPage.title,
        pages: sidebarListOfPages
      });
      await saveHtmlContent('404.html', readyHtml);
    }
  });
  copyStaticAssets();
};

module.exports = {
  findMdFiles: findMdFiles,
  getFilesContent: getFilesContent,
  convertMdToHtml: convertMdToHtml,
  buildStaticFiles: buildStaticFiles
};
