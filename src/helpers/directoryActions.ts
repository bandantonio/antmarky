import * as fs from 'fs';
import * as path from 'path';

async function createDirectory(dirPath:string) {
    try {
        await fs.promises.mkdir(dirPath);
    } catch (err) {
        throw new Error(`Cannot create the directory: '${dirPath}'`);
    }
}
async function cleanDirectoryContents(dirPath:string) {
    try {
        let contents = await fs.promises.readdir(dirPath);
        if (contents.length > 0) {
            for (let content of contents) {
                let contentPath = path.resolve(dirPath, content);
                await fs.promises.rm(contentPath, { recursive: true });
            }
        }
    } catch (err) {
        return Promise.reject(false);
    }
}
/* istanbul ignore next */
async function copyDirectoryContentsToDestination(sourceDirectory:string, destinationDirectory:string) {    
    try {
        await fs.promises.cp(sourceDirectory, destinationDirectory, { recursive: true });
    } catch (err) {
        console.log(err);
        throw new Error(`Cannot copy the contents of the directory: '${sourceDirectory}' to '${destinationDirectory}'`);
         
    }
}

async function directoryExists(dirPath:string) {
    try {
        let result = await fs.promises.access(dirPath, fs.constants.F_OK | fs.constants.W_OK);
        
        if (result === undefined) return true;
    } catch (err) {
        return false;
    }
}

export {
    createDirectory,
    cleanDirectoryContents,
    copyDirectoryContentsToDestination,
    directoryExists
}