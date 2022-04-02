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
  copyStaticAssetsSchema
} = require('../schemas/schemas');
const { embedRemoteMarkdown } = require('./embed-remote-markdown');
const { buildToc } = require('../toc');
const { errorPage } = require('../data/defaults');

// LOCATE MARKDOWN FILES
const findMdFiles = async (docsDir = 'docs') => {
  try {
    await findMdFilesSchema.validateAsync(docsDir);
  } catch (error) {
    throw Error(`invalid docs directory': ${error.message}`);
  }

  const normalizedDocsDir = docsDir.trim();
  const baseDirectoryPath = (normalizedDocsDir) ? path.join(process.cwd() + `/${normalizedDocsDir}`) : path.join(process.cwd());

  if (!fs.existsSync(baseDirectoryPath)) {
    throw Error('The specified directory does not exist');
  } else {
    const fileTree = [];
    const traverseDirectoryTree = (dir) => {
      const dirItems = fs.readdirSync(dir);
      for (const item of dirItems) {
        const relativePath = path.relative(baseDirectoryPath, dir);
        const absolutePath = path.join(dir, item);

        const dirLevel = (relativePath === '') ? 0 : relativePath.split('/').length;
        const pathToDirFull = (relativePath === '') ? 'home' : relativePath;
        const dirClass = pathToDirFull.substring(pathToDirFull.lastIndexOf('/') + 1, pathToDirFull.length);
        const dirName = dirClass[0].toUpperCase() + dirClass.substring(1, dirClass.length);

        if (fs.statSync(absolutePath).isDirectory()) {
          traverseDirectoryTree(absolutePath);
        } else {
          if (path.extname(item) === '.md') {
            const mdFile = item.substring(0, item.lastIndexOf('.'));
            const findIndex = fileTree.findIndex(obj => obj.dirPath === relativePath);
            if (findIndex >= 0) {
              fileTree[findIndex].files.push(mdFile);
            } else {
              fileTree.push({
                dirLevel: dirLevel,
                basePath: baseDirectoryPath,
                dirPath: relativePath,
                dirName: dirName,
                dirClass: dirClass,
                files: [mdFile]
              });
            }
          }
        }
      }
    };
    traverseDirectoryTree(baseDirectoryPath);

    return fileTree.sort((a, b) => {
      return a.dirLevel - b.dirLevel;
    });
  }
};

// GET CONTENTS OF MARKDOWN FILES
const getFilesContent = async (fileDetails) => {
  try {
    await filesContentSchema.validateAsync(fileDetails);
  } catch (error) {
    throw Error(`Can't get content from Markdown files: ${error.message}`);
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

// CONVERT MARKDOWN FILES TO HTML
const convertMdToHtml = (mdTextArray) => {
  const validation = convertMdToHtmlSchema.validate(mdTextArray);

  if (validation.error) {
    throw Error(`Can't convert. Input data is invalid: ${validation.error.message}`);
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

const saveHtmlContent = async (filename, htmlContent) => {
  try {
    await saveHtmlContentSchemaFile.validateAsync(filename);
    await saveHtmlContentSchemaContent.validateAsync(htmlContent);
  } catch (error) {
    throw Error(`Can't retrieve content to save html file(s). Something went wrong: ${error.message}`);
  }

  try {
    const outputFolder = 'public';
    const basePath = `${process.cwd()}/${outputFolder}`;
    await fsp.mkdir(basePath, { recursive: true });
    await fsp.writeFile(`${basePath}/${filename}`, htmlContent);
  } catch (error) {
    throw Error(`Can't save html file(s). Something went wrong: ${error.message}`);
  }
};

const buildContent = async (docsDir = 'docs') => {
  const locatedMdFiles = await findMdFiles(docsDir);
  const allPages = locatedMdFiles;
  const mdFilesContent = await getFilesContent(locatedMdFiles);
  const mdFilesWithRemoteContent = await embedRemoteMarkdown(mdFilesContent);
  const htmlContent = convertMdToHtml(mdFilesWithRemoteContent);
  return {
    allPages: allPages,
    htmlContent: htmlContent
  };
};

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

const removeOutputDirectory = (outputDirectory = 'public') => {
  const validateOutputDirectory = removeOutputDirectorySchema.validate(outputDirectory);

  if (validateOutputDirectory.error) {
    throw Error(`Error occurred when deleting the output folder: ${validateOutputDirectory.error.message}`);
  }
  fse.emptyDirSync(path.resolve(outputDirectory));
};

const copyStaticAssets = (staticFolder = 'assets', docsDir = 'docs') => {
  const validateStaticAssets = copyStaticAssetsSchema.validate(staticFolder);

  if (validateStaticAssets.error) {
    throw Error(`Error occurred when copying static assets: ${validateStaticAssets.error.message}`);
  }
  fse.copySync(path.resolve(path.join(process.cwd() + '/src/' + staticFolder)), path.resolve('public'));

  const docsStaticFolderPath = path.join(path.resolve('public'), staticFolder);

  if (fs.existsSync(docsStaticFolderPath)) {
    fse.copySync(path.resolve(path.join(process.cwd() + `/${docsDir}/` + staticFolder)), docsStaticFolderPath);
  }
};

const buildStaticFiles = async (docsDir = 'docs') => {
  removeOutputDirectory();
  const templatesPath = path.join(process.cwd() + '/views');
  const generatedContent = await buildContent(docsDir);
  const sidebarListOfPages = generatedContent.allPages.filter(page => page.name !== 'README');

  const items = await fsp.readdir(templatesPath);
  items.filter(item => path.extname(item) === '.ejs').forEach(template => {
    if (template === 'page.ejs') {
      const compiledTemplate = compileTemplate(templatesPath, template);
      const pageContent = generatedContent.htmlContent.filter(content => content.name !== 'README');
      pageContent.forEach(page => {
        const readyHtml = compiledTemplate({
          name: page.name,
          title: page.title,
          content: page.html,
          toc: page.toc,
          pages: sidebarListOfPages
        });
        saveHtmlContent(`${page.name}.html`, readyHtml);
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
        saveHtmlContent('index.html', readyHtml);
      } else {
        const compiledTemplate = compileTemplate(templatesPath, template);
        const readyHtml = compiledTemplate({
          name: '/',
          title: 'Home',
          content: md.makeHtml(fs.readFileSync(path.resolve('README.md'), 'utf-8')),
          pages: sidebarListOfPages
        });
        saveHtmlContent('index.html', readyHtml);
      }
    } else if (template === '404.ejs') {
      const compiledTemplate = compileTemplate(templatesPath, template);
      const readyHtml = compiledTemplate({
        name: '404',
        text: errorPage.text,
        title: errorPage.title,
        pages: sidebarListOfPages
      });
      saveHtmlContent('404.html', readyHtml);
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
