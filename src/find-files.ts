import * as fs from 'fs';
import * as path from 'path';
import defaultSettings from './default-settings';
import { filenameSchema } from './schemas/schemas';
import FileInfo from './interfaces/fileInfo';

/**
 * Find all Asciidoctor files within the specified directory
 */
// const findDocFiles = async (docsDirectoryName:string = defaultSettings.docsDirectory):Promise<FileInfo[]> => {
const findDocFiles = async (docsDirectoryName:string = defaultSettings.docsDirectory):Promise<FileInfo[]> => {
    const docsDirectoryPath = path.join(process.cwd() + `/${docsDirectoryName}`);
    
    if (!fs.existsSync(docsDirectoryPath)) {
        throw new Error(`Looks like the specified directory ${ docsDirectoryName } does not exist`);
    }
    
    const resultingFilesTree:FileInfo[] = [];
    
    // Find all the Asciidoctor files in the documentation directory and keep track of the child hierarchy
    const docFilesFilder = async (dir = docsDirectoryPath):Promise<FileInfo[]> => {
        // dirLevel is used to calculate hierarchy and children
        // 0 - docsDirectoryName, 1 - child dir for docsDirectoryName, etc
        // dirLevel is calculated via relative path
        const relativePath = path.relative(docsDirectoryPath, dir);
        const dirLevel = (relativePath === '') ? 0 : relativePath.split('/').length;
        
        // Class for the directory that is used to group files on the current hierarchical level (the 'last' directory in the path)
        const dirClass = (relativePath === '') ? 'home' : relativePath.substring(relativePath.lastIndexOf('/') + 1, relativePath.length);
        
        // Title case for the directory of the same dirClass
        const dirName = dirClass[0].toUpperCase() + dirClass.substring(1, dirClass.length);
        
        // Directory traversal logic
        const docFilesInFolder = getDocFiles(dir);
                
        if (docFilesInFolder.length > 0) {
            resultingFilesTree.push({
                dirLevel: dirLevel,
                basePath: docsDirectoryPath,
                dirPath: relativePath,
                dirClass: dirClass,
                dirName: dirName,
                files: docFilesInFolder
            });
        }
        
        const anyFolderInside = checkForChildrenFolders(dir);
        
        if (anyFolderInside.length > 0) {
            for (const directory of anyFolderInside) {
                await docFilesFilder(path.join(dir, directory));
            }
        }
        
        return resultingFilesTree;
    };
    
    const docFiles = await docFilesFilder();
    return docFiles;
};

const checkForChildrenFolders = (dir: string):string[] => {
    const items = fs.readdirSync(dir);
    return items.filter(item => {
        return path
        .join(dir, item)
        .match(/^(?!.*\/\.|.*node_modules).*$/gi);
    }).filter(item => fs
        .lstatSync(path.join(dir, item))
        .isDirectory());
    };

const getDocFiles = (dir: string) => {
    return fs.readdirSync(dir)
        .filter(file => path.extname(file) === '.adoc')
        .map(file => {
        const validation = filenameSchema.validate(file);
    
        if (validation.error) {
            throw new Error('Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)');
        }
    
        return {
            file: file,
            fileName: file.substring(0, file.lastIndexOf('.'))
        };
    });
};
export default findDocFiles;