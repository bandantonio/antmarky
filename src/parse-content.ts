import * as fs from 'fs';
import * as path from 'path';
import FileInfo from './interfaces/fileInfo';
import FileContent from './interfaces/fileContent';

const getFileContent = async (fileDetails:FileInfo[]):Promise<FileContent[]> => {
    if (!fileDetails.length) {
        throw new Error('Looks like you forgot to add files to your documentation directory');
    }
    
    const docFileContent:FileContent[] = [];
    
    for (const details of fileDetails) {
        const absolutePath = path.join(details.basePath, details.dirPath);
        // @ts-ignore
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

export default getFileContent;