import * as fs from 'fs';
import * as path from 'path';
import { directoryExists } from './helpers/directoryActions';
import defaultSettings from './default-settings';
import { ItemsList } from './interfaces/ItemDetails';

/**
 * Find all Asciidoctor files within the specified directory
 */

let findDocFiles = async (dir: string = defaultSettings.docsDirectory):Promise<ItemsList[]> => {
    let directoryContents = await docsDirectoryTraversal(dir);
    return directoryContents;
}

let docsDirectoryTraversal = async (directory: string):Promise<ItemsList[]> => {
    let traversedItems: ItemsList[] = [];
    
    const pathToCurrentDirectory = path.resolve(process.cwd(), directory);

    if (!await directoryExists(pathToCurrentDirectory)) {
        throw new Error(`Looks like the directory '${pathToCurrentDirectory}' does not exist`);
    }
    
    let currentDirectoryItems = await fs.promises.readdir(pathToCurrentDirectory, 'utf-8');
    
    if (!currentDirectoryItems.length) {
        throw new Error(`Looks like the '${pathToCurrentDirectory}' directory is empty`);
    }
    
    for (let currentItem of currentDirectoryItems) {       
        const pathToItem = path.resolve(pathToCurrentDirectory, currentItem);
        
        const itemType = await fs.promises.stat(pathToItem);
        const isItemADirectory = itemType.isDirectory();
        
        if (isItemADirectory) {
            traversedItems.push({
                name: currentItem,
                href: pathToItem,
                type: 'directory',
                children: await docsDirectoryTraversal(pathToItem)
            });
        } else {
            if (await isAsciiDocFile(pathToItem)) {
                traversedItems.push({
                    name: currentItem,
                    href: pathToItem,
                    type: 'file'
                });
            }
        }
    }
    
    return traversedItems;
}

async function isAsciiDocFile(file: string):Promise<boolean> {
    return Promise.resolve(path.extname(file) === '.adoc');
}

export default findDocFiles;