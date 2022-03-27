const ejs = require('ejs');
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs/promises');
const path = require('path');
let { md } = require('./md-parser');
let { findMdFilesSchema,
      filesContentSchema,
      convertMdToHtmlSchema,
      saveHtmlContentSchemaFile,
      saveHtmlContentSchemaContent,
      compileTemplateSchemaTemplatesPath,
      compileTemplateSchemaTemplate,
      removeOutputDirectorySchema,
      copyStaticAssetsSchema
    } = require('../schemas/schemas');
let { embedRemoteMarkdown } = require('./embed-remote-markdown');
let { buildToc } = require('../toc');
let { errorPage } = require('../data/defaults');

// LOCATE MARKDOWN FILES
let findMdFiles = async (docsDir = 'docs') => {
  try {
    await findMdFilesSchema.validateAsync(docsDir);
  } catch (error) {
    throw Error(`invalid docs directory': ${error.message}`);
  }

  let normalizedDocsDir = docsDir.trim();
  const baseDirectoryPath = (normalizedDocsDir) ? path.join(process.cwd() + `/${normalizedDocsDir}`) : path.join(process.cwd());
  
  if (!fs.existsSync(baseDirectoryPath)) {
    throw Error('The specified directory does not exist');
  } else {
    let fileTree = [];
    let traverseDirectoryTree = (dir) => {
      let dirItems = fs.readdirSync(dir);
      for (let item of dirItems) {
        let relativePath = path.relative(baseDirectoryPath, dir);
        let absolutePath = path.join(dir, item);
        
        let dirLevel = (relativePath == "") ? 0 : relativePath.split('/').length;
        let pathToDirFull = (relativePath == '') ? 'home' : relativePath ;
        let dirClass = pathToDirFull.substring(pathToDirFull.lastIndexOf('/') + 1, pathToDirFull.length);
        let dirName = dirClass[0].toUpperCase() + dirClass.substring(1, dirClass.length);
        
        if (fs.statSync(absolutePath).isDirectory()) {
          traverseDirectoryTree(absolutePath);
        } else {
          if (path.extname(item) == '.md') {
            let mdFile = item.substring(0, item.lastIndexOf('.'));
            let findIndex = fileTree.findIndex(obj => obj.dirPath == relativePath);
            if (findIndex >= 0) {
              fileTree[findIndex].files.push(mdFile);
            } else {
              fileTree.push({
                dirLevel: dirLevel,
                basePath: baseDirectoryPath,
                dirPath: relativePath,
                dirName: dirName,
                dirClass: dirClass,
                files: [ mdFile ]
              })
            }
          }
        }
      }
    }
    traverseDirectoryTree(baseDirectoryPath);
    
    return fileTree.sort((a, b) => {
      return a.dirLevel - b.dirLevel;
    })
  }
}

// GET CONTENTS OF MARKDOWN FILES
let getFilesContent = async (fileDetails) => {
  try {
    await filesContentSchema.validateAsync(fileDetails);
  } catch (error) {
    throw Error(`Can't get content from Markdown files: ${error.message}`);
  }

  let mdFileContent = [];
  for (let details of fileDetails) {
    let absolutePath = path.join(details.basePath, details.dirPath);
    details.files.forEach(file => {
      let content = fs.readFileSync(path.join(absolutePath, `${file}.md`), { encoding: 'utf-8'});
      mdFileContent.push({
        name: file,
        title: file,
        content: content
      })
    });
  }
  return mdFileContent;
}

// CONVERT MARKDOWN FILES TO HTML
let convertMdToHtml = (mdTextArray) => {
  let validation = convertMdToHtmlSchema.validate(mdTextArray);

  if (validation.error) {
    throw Error(`Can't convert. Input data is invalid: ${validation.error.message}`);
  }
  return mdTextArray.map(mdText => {
    let html = md.makeHtml(mdText.content);
    let tableOfCOntents = buildToc(html);
    return {
      name: mdText.name,
      title: mdText.title,
      html,
      toc: tableOfCOntents
    }
  });
}

let saveHtmlContent = async (filename, htmlContent) => {
  try {
    await saveHtmlContentSchemaFile.validateAsync(filename);
    await saveHtmlContentSchemaContent.validateAsync(htmlContent);
  } catch (error) {
    throw Error(`Can't retrieve content to save html file(s). Something went wrong: ${error.message}`);
  }
  
  try {
    let outputFolder = 'public';
    let basePath = `${process.cwd()}/${outputFolder}`;
    await fsp.mkdir(basePath, { recursive: true });
    await fsp.writeFile(`${basePath}/${filename}`, htmlContent);
  } catch (error) {
    throw Error(`Can't save html file(s). Something went wrong: ${error.message}`);  
  }
}

let buildContent = async (docsDir = 'docs') => {
  let locatedMdFiles = await findMdFiles(docsDir);
  let allPages = locatedMdFiles;
  let mdFilesContent = await getFilesContent(locatedMdFiles);
  let mdFilesWithRemoteContent = await embedRemoteMarkdown(mdFilesContent);
  let htmlContent = convertMdToHtml(mdFilesWithRemoteContent);
  return {
    allPages: allPages,
    htmlContent: htmlContent
  }
}

let compileTemplate = (templatesPath, template) => {
  let validateTemplatesPath = compileTemplateSchemaTemplatesPath.validate(templatesPath);
  let validateTemplate = compileTemplateSchemaTemplate.validate(template);

  if (validateTemplatesPath.error || validateTemplate.error) {
    throw Error('Error occurred when compiling template');
  } 

  let compiledTemplate = ejs.compile(fs.readFileSync(templatesPath + '/' + template, 'utf-8'), {
    encoding: 'utf-8',
    views: [ path.resolve(templatesPath) ]
  });
  return compiledTemplate;
} 

let removeOutputDirectory = (outputDirectory = 'public') => {
  let validateOutputDirectory = removeOutputDirectorySchema.validate(outputDirectory);

  if (validateOutputDirectory.error) {
    throw Error(`Error occurred when deleting the output folder: ${validateOutputDirectory.error.message}`);
  }
  fse.emptyDirSync(path.resolve(outputDirectory));
}

let copyStaticAssets = (staticFolder = 'assets') => {
  let validateStaticAssets = copyStaticAssetsSchema.validate(staticFolder);

  if (validateStaticAssets.error) {
    throw Error(`Error occerred when copying static assets: ${validateStaticAssets.error.message}`)
  }
  fse.copySync(path.resolve(path.join(process.cwd() + '/src/' + staticFolder)), path.resolve('public'));
}

let buildStaticFiles = async (docsDir = 'docs') => {
  removeOutputDirectory();
  const templatesPath = path.join(process.cwd() + '/views');
  let generatedContent = await buildContent(docsDir);
  let sidebarListOfPages = generatedContent.allPages.filter(page => page.name !== 'README');
  try {
    let items = await fsp.readdir(templatesPath);
    items.filter(item => path.extname(item) == '.ejs').forEach(template => {
      if (template == 'page.ejs') {
        let compiledTemplate = compileTemplate(templatesPath, template);
        let pageContent = generatedContent.htmlContent.filter(content => content.name !== 'README');
        pageContent.forEach(page => {
          let readyHtml = compiledTemplate({
            name: page.name,
            title: page.title,
            content: page.html,
            toc: page.toc,
            pages: sidebarListOfPages
          });
          saveHtmlContent(`${page.name}.html`, readyHtml);
        })
      } else if (template == 'index.ejs') {
        let compiledTemplate = compileTemplate(templatesPath, template);
        let indexPage = generatedContent.htmlContent.find(content => content.name == 'README');
        if (indexPage) {
          let readyHtml = compiledTemplate({
            name: indexPage.name,
            title: indexPage.title,
            content: indexPage.html,
            pages: sidebarListOfPages
          });
          saveHtmlContent('index.html', readyHtml);
        } else {
          let compiledTemplate = compileTemplate(templatesPath, template);
          let readyHtml = compiledTemplate({
            name: '/',
            title: 'Home',
            content: md.makeHtml(fs.readFileSync(path.resolve('README.md'), 'utf-8')),
            pages: sidebarListOfPages
          });
          saveHtmlContent('index.html', readyHtml);
        }
      } else if (template == '404.ejs') {
        let compiledTemplate = compileTemplate(templatesPath, template);
        let readyHtml = compiledTemplate({
          name: '404',
          text: errorPage.text,
          title: errorPage.title,
          pages: sidebarListOfPages
        });
        saveHtmlContent('404.html', readyHtml);
      }
    })
  } catch (err) {
    throw err;
  }
  copyStaticAssets();
}

module.exports = {
  findMdFiles: findMdFiles,
  getFilesContent: getFilesContent,
  convertMdToHtml: convertMdToHtml,
  buildStaticFiles: buildStaticFiles
}