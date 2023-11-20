import compileTemplates from './compileTemplates';
import FileContent from './schemas/fileContent';
import * as fileOperations from './helpers/fileOperations';

// This function is located here (instead of getContent) because it should get all the pages that are available,
// not just the ones that are being processed
/**
 * @private
 */
const getSidebarPages = async (fileContent: FileContent[]) => {
    let sidebarPages = [];

    for await (let file of fileContent) {
        if (file.fileName !== 'index') {
            const fileRelativePath = file.fileRelativeDir;

            sidebarPages.push({
                path: fileRelativePath,
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
        const fileName = file.fileName;
        const fileRelativePath = file.fileRelativeDir;

        const compiledHtmlPage = await compiledTemplates.page({
            pageName: file.fileName,
            title: file.fileTitle,
            html: file.fileHtmlContent,
            sidebarPages,
            tableOfContents: file.tableOfContents
        });

        await fileOperations.write(fileRelativePath, fileName, compiledHtmlPage);
    }
};

export { saveHtmlPages }