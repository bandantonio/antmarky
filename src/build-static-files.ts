import * as fs from 'fs';
import * as path from 'path';
import defaultSettings from './default-settings';
import removeOutputDirectory from './remove-output-directory';
import buildContent from './build-content';
import compileTemplate from './compile-template';
import saveHtmlContent from './save-html-content';
import { adoc, asciidoctorDefaultConfig } from './asciidoc-parser';
import copyStaticAssets from './copy-assets';

const buildStaticFiles = async (docsDirectoryName = defaultSettings.docsDirectory, outputDirectory = defaultSettings.outputDirectory) => {
    removeOutputDirectory(outputDirectory);
    
    const generatedContent = await buildContent(docsDirectoryName);
    // @ts-ignore
    const sidebarListOfPages = generatedContent.allPages.filter(page => page.name !== 'README');
    const items = await fs.promises.readdir(defaultSettings.viewsDirectory);
    items.filter(item => path.extname(item) === '.ejs').forEach(async template => {
        if (template === 'page.ejs') {
            const compiledTemplate = compileTemplate(template);
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
            const compiledTemplate = compileTemplate(template);
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
                const compiledTemplate = compileTemplate(template);
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
            const compiledTemplate = compileTemplate(template);
            // @ts-ignore
            const readyHtml = compiledTemplate({
                name: '404',
                text: defaultSettings.errorPage.text,
                title: defaultSettings.errorPage.title,
                pages: sidebarListOfPages
            });
            await saveHtmlContent('404.html', readyHtml);
        }
    });
    copyStaticAssets();
};

export default buildStaticFiles;