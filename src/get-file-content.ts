import * as fs from 'fs';
import { ItemsList, ItemsWithContent } from './interfaces/ItemDetails';

const getFileContent = async (files:ItemsList[]):Promise<ItemsWithContent[]> => {
    let filesWithContent:ItemsWithContent[] = [];
    
    for (const fileDetails of files) {
        if (fileDetails.type !== 'file') {
            let filesContent = await getFileContent(fileDetails.children as ItemsList[]);
            filesWithContent.push(...filesContent);
            
            continue;
        }
        
        let fileContent = await fs.promises.readFile(fileDetails.href!, 'utf-8');
        
        filesWithContent.push({
            name: fileDetails.name as string,
            href: fileDetails.href as string,
            content: fileContent
        });
    }
    
    return filesWithContent;
};

export default getFileContent;