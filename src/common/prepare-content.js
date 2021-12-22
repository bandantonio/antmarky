const ejs = require('ejs');
const fs = require('fs');
const fse = require('fs-extra');
const fsp = require('fs/promises');
let { md } = require('./md-parser');
const path = require('path');
let { buildToc } = require('../toc');
let { errorPage } = require('../data/defaults');

// LOCATE MARKDOWN FILES
let findMdFiles = async () => {
  const directoryPath = path.join(process.cwd());
  try {
    let files = await fsp.readdir(directoryPath);
    return files.filter(file => path.extname(file) == '.md').map(mdFile => {
      return {
        name: mdFile.substring(0, mdFile.lastIndexOf('.')),
        path: path.resolve(mdFile)
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// GET CONTENTS OF MARKDOWN FILES
let getFilesContent = async (fileDetails) => {
  return fileDetails.map(details => {
    let content = fs.readFileSync(details.path, { encoding: 'utf-8'});
    return {
      name: details.name,
      title: details.name,
      content: content
    }
  })
}

let convertCrossLinks = (mdText) => {
  return mdText.replace(/\.md/g, '.html')
}

// CONVERT MARKDOWN FILES TO HTML
let convertMdToHtml = (mdTextArray) => {  
  return mdTextArray.map(mdText => {
    let linksInContent = convertCrossLinks(mdText.content);
    let html = md.makeHtml(linksInContent);
    let tableOfCOntents = buildToc(html);
    return {
      name: mdText.name,
      title: mdText.title,
      html,
      toc: tableOfCOntents
    }
  });
}

let saveHtmlContent = (filename, htmlContent) => {
  let outputFolder = 'public';
  let basePath = `${process.cwd()}/${outputFolder}`;
  fs.mkdirSync(basePath, { recursive: true });
  fs.writeFileSync(`${basePath}/${filename}`, htmlContent);
}

let buildContent = async () => {
  let locatedMdFiles = await findMdFiles();
  let allPages = locatedMdFiles;
  let filesMdContent = await getFilesContent(locatedMdFiles);
  let htmlContent = convertMdToHtml(filesMdContent);
  return {
    allPages: allPages,
    htmlContent: htmlContent
  }
}

let compileTemplate = (templatesPath, template) => {
  let compiledTemplate = ejs.compile(fs.readFileSync(templatesPath + '/' + template, 'utf-8'), {
    encoding: 'utf-8',
    views: [ path.resolve(templatesPath) ]
  });
  return compiledTemplate;
} 

let removeOutputDirectory = (outputDirectory = 'public') => {
  fs.rmSync(path.resolve(outputDirectory), { recursive: true, force: true });
}

let copyStaticAssets = (staticFolder = 'src/assets') => {
  fse.copySync(path.resolve(staticFolder), path.resolve('public'));
}

let buildStaticFiles = async () => {
  removeOutputDirectory();
  const templatesPath = path.join(process.cwd() + '/views');
  let generatedContent = await buildContent();
  let sidebarListOfPages = generatedContent.allPages.filter(page => page.link !== 'index');
  try {
    let items = await fsp.readdir(templatesPath);
    items.filter(item => path.extname(item) == '.ejs').forEach(template => {
      if (template == 'page.ejs') {
        let compiledTemplate = compileTemplate(templatesPath, template);
        let pageContent = generatedContent.htmlContent.filter(content => content.name !== 'index');
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
        let indexPage = generatedContent.htmlContent.find(content => content.name == 'index');
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
            content: md.makeHtml(convertCrossLinks(fs.readFileSync(path.resolve('README.md'), 'utf-8'))),
            pages: sidebarListOfPages
          });
          saveHtmlContent('index.html', readyHtml);
        }
      } else if (template == '404.ejs') {
        let compiledTemplate = compileTemplate(templatesPath, template);
        let readyHtml = compiledTemplate({
          text: errorPage.text,
          title: errorPage.title
        });
        saveHtmlContent('404.html', readyHtml);
      }
    })
  } catch (err) {
    console.log(err);
  }
  copyStaticAssets();
}

module.exports = {
  findMdFiles: findMdFiles,
  getFilesContent: getFilesContent,
  convertCrossLinks: convertCrossLinks,
  convertMdToHtml: convertMdToHtml,
  buildStaticFiles: buildStaticFiles
}