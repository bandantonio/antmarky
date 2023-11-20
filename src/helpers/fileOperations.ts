import * as fs from 'fs/promises';
import path from 'path';
import config from '../config/defaultConfiguration';


const read = async (filePath: string): Promise<string> => {
  return await fs.readFile(filePath, 'utf-8');
}

const write = async (fileRelativePath: string, fileName: string, htmlContent: string): Promise<void> => {
  const destinationPath = path.join(process.cwd(), config.outputDirectory, fileRelativePath);

  await fs.mkdir(destinationPath, { recursive: true });

  const filePath = `${destinationPath}/${fileName}.html`;

  await fs.writeFile(filePath, htmlContent, 'utf-8');
}

// const copy = async (source: string, destination: string): Promise<void> => {

// }


export { read, write }