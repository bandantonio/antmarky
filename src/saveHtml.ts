import fse from 'fs-extra';
import path from 'path';
import compileTemplates from './compileTemplates';
import config from './config/defaultConfiguration';
import FileContent from './schemas/fileContent';

// This function is located here (instead of getContent) because it should get all the pages that are available,
// not just the ones that are being processed
/**
 * @private
 */
const getSidebarPages = async (fileContent: FileContent[]) => {
    let sidebarPages = [];

    for await (let file of fileContent) {
        if (file.fileName !== 'index') {
            sidebarPages.push({
                name: file.fileName,
                title: file.fileTitle
            });
        }
    }

    // Sort the pages in sidebar in ascending order
    sidebarPages.sort((a, b) => (a.title > b.title) ? 1 : -1);

    return sidebarPages;
};

const saveHtmlPages = async (fileContent: FileContent[]) => {
    const compiledTemplates = await compileTemplates();
    const sidebarPages = await getSidebarPages(fileContent);

    for await (let file of fileContent) {
        let fileName = file.fileName;

        const compiledHtmlPage = await compiledTemplates.page({
            pageName: fileName,
            title: file.fileTitle,
            html: file.fileHtmlContent,
            sidebarPages,
            tableOfContents: file.tableOfContents
        });

        await saveToFile(fileName, compiledHtmlPage);
    }
};

/**
 * @private
 * @param filename 
 * @param htmlContent 
 */
const saveToFile = async (filename: string, htmlContent: string) => {
    const outputDirectory = config.outputDirectory;
    const basePath = path.join(process.cwd(), outputDirectory);

    await fse.writeFile(path.join(basePath, `${filename}.html`), htmlContent, 'utf-8');
}

export default saveHtmlPages;