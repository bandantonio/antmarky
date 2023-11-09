import fse from 'fs-extra';
import path from 'path';

// async function createDirectory(dirPath: string) {
//     try {
//         await fs.promises.mkdir(dirPath);
//     } catch (err) {
//         throw new Error(`Cannot create the directory: '${dirPath}'`);
//     }
// }
async function emptyDirectory(dir: string): Promise<string | void> {
    try {
        await fse.emptyDir(path.resolve(dir));
    } catch (error) {
        throw new Error(`Cannot empty the directory: '${dir}'`);
    }
}

/* istanbul ignore next */
// TODO: Rewrite the function so it can be properly tested by mock-fs
// mock-fs cannot mock the fs.promises.cp. Issue: https://github.com/tschaub/mock-fs/issues/358
// make sure fs-extra is necessary
// async function copyDirectoryContentsToDestination(sourceDirectory:string, destinationDirectory:string) {       
//     const resultingDestinationDirectory = path.join(destinationDirectory);  
//     try {        
//         await fse.copy(sourceDirectory, resultingDestinationDirectory);
//     } catch (err) {        
//         throw new Error(`Cannot copy the contents of the directory: '${sourceDirectory}' to '${resultingDestinationDirectory}'`);
//     }
// }

async function doesDirectoryExist(dirPath: string) {
    const exists = await fse.pathExists(path.resolve(dirPath));

    return exists ? true : false;
}

export {
    emptyDirectory,
    doesDirectoryExist
}