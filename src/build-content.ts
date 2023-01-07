import defaultSettings from './default-settings';
import findDocFiles from './find-files';
import getFileContent from './parse-content';
import convertDocToHtml from './adoc-to-html';

/**
 * Wrapper function to find Asciidoctor files and convert content to HTML
 * Returns an object containing two arrays:
 * - an array of objects with hierarchy of all pages
 * - an array of objects with all pages and corresponding HTML content
 */
const buildContent = async (docsDirectoryName = defaultSettings.docsDirectory) => {
    const locatedDocFiles = await findDocFiles(docsDirectoryName);
    const docFilesContent = await getFileContent(locatedDocFiles);
    const htmlContent = convertDocToHtml(docFilesContent);
    
    return {
        allPages: locatedDocFiles,
        htmlContent: htmlContent
    };
};

export default buildContent;