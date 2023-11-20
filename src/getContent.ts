import path from 'path';
import { Document } from 'asciidoctor';
import { asciidoctor, asciidoctorConfig } from './asciidoc-processor';
import FileContent from './schemas/fileContent';
import config from './config/defaultConfiguration';

/**
 * Get the content of the Asciidoctor files
 * @param filePaths Array of file paths
 * @returns Promise<Array> Array of objects with fileName, fileDir and fileContent
 */
const getDocFileContent = async (filePaths: string[]): Promise<FileContent[]> => {
    let filesWithContent: FileContent[] = [];

    for await (const file of filePaths) {
        let fileDetails = asciidoctor.loadFile(file, asciidoctorConfig);

        let fileName = fileDetails.getAttribute('docname');

        // If there is a README file, make it the index page
        fileName = fileName === 'README' ? 'index' : fileName;

        const sanitizedFileName = fileName.replace(/ /g, '-').toLowerCase();
        const fileTitle = fileName.replace(/\b\w/g, (l: string) => l.toUpperCase());
        let fileDir = fileDetails.getBaseDir();
        
        const pathToSourceDocsDir = path.join(process.cwd(), config.docsDirectory);
        let fileRelativeDir = path.relative(pathToSourceDocsDir, fileDir);

        let fileHtmlContent = fileDetails.getContent()!;
        let tableOfContents = await getTableOfContents(fileDetails);

        filesWithContent.push({
            fileName: sanitizedFileName,
            fileTitle,
            fileRelativeDir,
            fileHtmlContent,
            tableOfContents
        });
    }

    // Ensure items are sorted alphabetically based on fileName
    filesWithContent.sort((a, b) => (a.fileName > b.fileName) ? 1 : -1);

    // fs.writeFile('contents.js', JSON.stringify(filesWithContent, null, 2), 'utf8');

    return filesWithContent;
};

const getTableOfContents = async (fileDetails: Document) => {
    let tableOfContents = [];
    let details = fileDetails.getRefs();

    for (const key in details) {
        const { id, title, level } = details[key];
        tableOfContents.push({
            id,
            title,
            level
        });
    }

    return tableOfContents;
};

export default getDocFileContent;