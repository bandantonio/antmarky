import findDocFiles from "./find-files";
import getFileContent from "./get-file-content";
import convertDocToHtml from "./convert-adoc-to-html";
import compileEjsTemplates from "./compile-templates";
import buildTableOfContents from "./build-table-of-contents";
import defaultSettings from "./default-settings";
import { ItemsWithHtml, ItemToRender } from "./interfaces/ItemDetails";

const processContent = async ():Promise<ItemsWithHtml[]> => {
    const locatedDocFiles = await findDocFiles();    
    const docFilesContent = await getFileContent(locatedDocFiles);   
    const htmlContent = convertDocToHtml(docFilesContent);
    
    return htmlContent;
};

const getItemDataToRender = async (pageName:string, htmlContent:ItemsWithHtml[]):Promise<ItemToRender> => {
    const itemData = await Promise.resolve(htmlContent.find(page => page.name === pageName));
    
    if (!itemData) {
        return {
            status: 404,
            title: defaultSettings.errorPage.title,
            html: defaultSettings.errorPage.html
        };
    }

    const sidebarListOfPages = await Promise.all(htmlContent.filter(page => page.name !== 'index.html'));
    const tableOfContents = await buildTableOfContents(itemData.html);
    return {
        status: 200,
        title: itemData.title,
        html: itemData.html,
        sidebarPages: sidebarListOfPages,
        tableOfContents: tableOfContents
    }
}

export {
    processContent,
    getItemDataToRender as getItemData
};