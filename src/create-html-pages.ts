import compileEjsTemplates from "./compile-templates";
import * as fs from 'fs';
import * as path from 'path';
import defaultSettings from './default-settings';
import { ItemsWithHtml } from './interfaces/ItemDetails';
import { saveHtmlContentSchemaFile, saveHtmlContentSchemaContent } from './schemas/schemas'
import buildTableOfContents from "./build-table-of-contents";

const createHtmlPages = async (htmlContent:ItemsWithHtml[]) => {
    const compiledTemplates = await compileEjsTemplates();
    
    for (let item of htmlContent) {
        let sidebarListOfPages = await Promise.all(htmlContent.filter(page => page.name !== 'index.html'));
        const pageName = item.name;
        const tableOfContents = await buildTableOfContents(item.html);
        const compiledHtmlPage = await compiledTemplates.page({
            pageName,
            sidebarPages: await sidebarListOfPages,
            title: item.title,
            html: item.html,
            tableOfContents: tableOfContents
        });
        await saveHtmlContent(item.name, compiledHtmlPage);
    }
    const compiledErrorPage = await compiledTemplates.error({
        title: defaultSettings.errorPage.title,
        html: defaultSettings.errorPage.html
    });
    await saveHtmlContent('404.html', compiledErrorPage);
    
}

const saveHtmlContent = async (filename:string, htmlContent:string) => {    
    const outputDirectory = defaultSettings.outputDirectory
    // await saveHtmlContentSchemaFile.validateAsync(filename);
    // await saveHtmlContentSchemaContent.validateAsync(htmlContent);
    
    const basePath = path.resolve(process.cwd(), outputDirectory);
    
    await fs.promises.mkdir(basePath, { recursive: true });
    await fs.promises.writeFile(path.resolve(basePath, filename), htmlContent, 'utf-8');
}

export default createHtmlPages;