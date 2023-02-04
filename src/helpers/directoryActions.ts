import * as fs from 'fs';
import * as fse from 'fs-extra';
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
// TODO: Rewrite the function so it can be properly tested by mock-fs
// mock-fs cannot mock the fs.promises.cp. Issue: https://github.com/tschaub/mock-fs/issues/358
// make sure fs-extra is necessary
async function copyDirectoryContentsToDestination(sourceDirectory:string, destinationDirectory:string) {       
    const resultingDestinationDirectory = path.join(destinationDirectory);  
    try {        
        await fse.copy(sourceDirectory, resultingDestinationDirectory);
    } catch (err) {        
        throw new Error(`Cannot copy the contents of the directory: '${sourceDirectory}' to '${resultingDestinationDirectory}'`);
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