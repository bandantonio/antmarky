import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as ejs from 'ejs';
import { adoc, asciidoctorDefaultConfig } from './parsers';
import {
  // findDocFilesSchema,
  filesContentSchema,
  convertDocToHtmlSchema,
  saveHtmlContentSchemaFile,
  saveHtmlContentSchemaContent,
  compileTemplateSchemaTemplatesPath,
  compileTemplateSchemaTemplate,
  removeOutputDirectorySchema,
  buildStaticFilesSchema,
  copyStaticAssetsSchema
} from '../schemas/schemas';
import checkForChildrenFolders from '../helpers/checkForChildrenFolders';
import { FileData, getDocFiles } from '../helpers/getDocFiles';
import buildToc from '../toc'
import errorPage from '../data/defaults';

const defaultDocsDirectory = 'docs';
const defaultOutputDirectory = 'public';
const defaultAssetsDirectory = 'assets';
export interface FileInfo {
  dirLevel: number,
  basePath: string,
  dirPath: string,
  dirClass: string,
  dirName: string,
  files: FileData[]
}

export interface FileContent {
  name: FileData,
  title: string,
  content: string
}

/**
 * Find all Asciidoctor files within the specified directory
 */
const findDocFiles = async (docsDirectoryName:string = defaultDocsDirectory):Promise<FileInfo[]> => {

  const docsDirectoryPath = path.join(process.cwd() + `/${docsDirectoryName}`);

  if (!fs.existsSync(docsDirectoryPath)) {
    throw new Error(`Looks like the specified directory ${ docsDirectoryName } does not exist`);
  }

  const resultingFilesTree:FileInfo[] = [];

  // Find all the Asciidoctor files in the documentation directory and keep track of the child hierarchy
  const docFilesFilder = async (dir = docsDirectoryPath):Promise<FileInfo[]> => {
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
    const docFilesInFolder = getDocFiles(dir);

    if (docFilesInFolder.length > 0) {
      resultingFilesTree.push({
        dirLevel: dirLevel,
        basePath: docsDirectoryPath,
        dirPath: relativePath,
        dirClass: dirClass,
        dirName: dirName,
        files: docFilesInFolder
      });
    }

    const anyFolderInside = checkForChildrenFolders(dir);

    if (anyFolderInside.length > 0) {
      for (const directory of anyFolderInside) {
        await docFilesFilder(path.join(dir, directory));
      }
    }

    return resultingFilesTree;
  };
  
  const docFiles = await docFilesFilder();
  return docFiles;
};

/**
 * Get content of Asciidoctor files
 */
const getFilesContent = async (fileDetails:FileInfo[]):Promise<FileContent[]> => {
  if (!fileDetails.length) {
    throw new Error('Looks like you forgot to add files to your documentation directory');
  }

  const docFileContent:FileContent[] = [];

  for (const details of fileDetails) {
    const absolutePath = path.join(details.basePath, details.dirPath);
    details.files.forEach(file => {
      const content = fs.readFileSync(path.join(absolutePath, file.file), { encoding: 'utf-8' });
      docFileContent.push({
        name: file,
        title: file.fileName,
        content: content
      });
    });
  }
  
  return docFileContent;
};

/**
 * Convert Asciidoctor files to HTML
 */
const convertDocToHtml = (docTextArray:FileContent[]) => {
  return docTextArray.map(docText => {
    const fileName = docText.name.file;
    const fileTitle = docText.title;
    const html = adoc.convert(docText.content, asciidoctorDefaultConfig);
    
    const tableOfCOntents = buildToc(html as string);

    return {
      name: fileName.substring(0, fileName.lastIndexOf('.')),
      title: fileTitle.substring(0, fileTitle.lastIndexOf('.')),
      html,
      toc: tableOfCOntents
    };
  });
};

/**
 * Save HTML content to a file
 */
const saveHtmlContent = async (filename:string, htmlContent:string, outputDirectory = defaultOutputDirectory) => {
  await saveHtmlContentSchemaFile.validateAsync(filename);
  await saveHtmlContentSchemaContent.validateAsync(htmlContent);
  const basePath = path.join(process.cwd(), outputDirectory);

  await fs.promises.mkdir(basePath, { recursive: true });
  await fs.promises.writeFile(path.join(basePath, filename), htmlContent);
};

/**
 * Wrapper function to find Asciidoctor files and convert content to HTML
 * Returns an object containing two arrays:
 * - an array of objects with hierarchy of all pages
 * - an array of objects with all pages and corresponding HTML content
 */
const buildContent = async (docsDirectoryName = defaultDocsDirectory) => {
  const locatedDocFiles = await findDocFiles(docsDirectoryName);
  const docFilesContent = await getFilesContent(locatedDocFiles);
  const htmlContent = convertDocToHtml(docFilesContent);
  
  return {
    allPages: locatedDocFiles,
    htmlContent: htmlContent
  };
};

/**
 * Compile EJS partials into a working template
 */
const compileTemplate = (templatesPath:string, template:string) => {
  const validateTemplatesPath = compileTemplateSchemaTemplatesPath.validate(templatesPath);
  const validateTemplate = compileTemplateSchemaTemplate.validate(template);

  if (!validateTemplatesPath.error || !validateTemplate.error) {
    const compiledTemplate = ejs.compile(fs.readFileSync(templatesPath + '/' + template, 'utf-8'), {
      views: [path.resolve(templatesPath)]
    });
    return compiledTemplate;
  }
};

/**
 * Remove output directory before generating files
 */
const removeOutputDirectory = (outputDirectory = defaultOutputDirectory) => {
  const validateOutputDirectory = removeOutputDirectorySchema.validate(outputDirectory);

  if (validateOutputDirectory.error) {
    throw Error(`Error occurred when deleting the output directory: ${validateOutputDirectory.error.message}`);
  }
  fse.emptyDirSync(path.resolve(outputDirectory));
};

/**
 * Copy source and docs assets to the corresponding directories
 */
const copyStaticAssets = (staticFolder = defaultAssetsDirectory, docsDirectoryName = defaultDocsDirectory) => {
  const validateStaticAssets = copyStaticAssetsSchema.validate(staticFolder);

  if (!validateStaticAssets.error) {
    fse.copySync(path.resolve(path.join(process.cwd() + '/src/' + staticFolder)), path.resolve(defaultOutputDirectory));
  }

  const docsStaticFolderPath = path.join(path.resolve(docsDirectoryName), staticFolder);
  const publicStaticFolderPath = path.join(path.resolve(defaultOutputDirectory), staticFolder);

  if (fs.existsSync(docsStaticFolderPath)) {
    fse.copySync(docsStaticFolderPath, publicStaticFolderPath);
  }
};

/**
 * Do the magic :)
 */
const buildStaticFiles = async (docsDirectoryName = defaultDocsDirectory, outputDirectory = defaultOutputDirectory) => {
  removeOutputDirectory(outputDirectory);
  const templatesPath = path.join(process.cwd() + '/src/views');
  const generatedContent = await buildContent(docsDirectoryName);
  // @ts-ignore
  const sidebarListOfPages = generatedContent.allPages.filter(page => page.name !== 'README');
  const items = await fs.promises.readdir(templatesPath);
  items.filter(item => path.extname(item) === '.ejs').forEach(async template => {
    if (template === 'page.ejs') {
      const compiledTemplate = compileTemplate(templatesPath, template);
      const pageContent = generatedContent.htmlContent.filter(content => content.name !== 'README');
      pageContent.forEach(async page => {
        // @ts-ignore
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
        // @ts-ignore
        const readyHtml = compiledTemplate({
          name: indexPage.name,
          title: indexPage.title,
          content: indexPage.html,
          pages: sidebarListOfPages
        });
        await saveHtmlContent('index.html', readyHtml);
      } else {
        const compiledTemplate = compileTemplate(templatesPath, template);
        // @ts-ignore
        const readyHtml = compiledTemplate({
          name: '/',
          title: 'Home',
          content: adoc.convert(fs.readFileSync(path.resolve('README.adoc'), 'utf-8'), asciidoctorDefaultConfig),
          pages: sidebarListOfPages
        });
        await saveHtmlContent('index.html', readyHtml);
      }
    } else if (template === '404.ejs') {
      const compiledTemplate = compileTemplate(templatesPath, template);
      // @ts-ignore
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

export {
  findDocFiles,
  getFilesContent,
  convertDocToHtml,
  buildStaticFiles
};
