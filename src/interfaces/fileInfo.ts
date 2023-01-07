import FileData from './fileData';

interface FileInfo {
    dirLevel: number,
    basePath: string,
    dirPath: string,
    dirClass: string,
    dirName: string,
    files: FileData[]
}

export default FileInfo;