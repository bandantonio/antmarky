import { glob } from 'glob';
import path from 'path';
import config from './config/defaultConfiguration';
import { doesDirectoryExist } from './helpers/directoryActions';

/**
 * Find all Asciidoctor files within the specified directory
 * @param dir Directory to search for Asciidoctor files. Default: 'docs
 * @returns Promise<Array> File paths
 */

let findDocFiles = async (dir: string = config.docsDirectory): Promise<string[]> => {
  const dirExists = await doesDirectoryExist(dir);

  if (!dirExists) {
    throw new Error(`Looks like the '${dir}' directory does not exist`);
  }

  const filePaths = await glob(path.join(dir, '**/*.adoc'), { ignore: '**/node_modules/**' });

  if (filePaths.length === 0) {
    throw new Error(`Looks like the '${dir}' directory is empty`);
  }

  const doesReadmeExist = filePaths.some(filePath => {
    const fileName = path.basename(filePath).toLowerCase();

    return fileName === 'readme.adoc';
  });

  if (!doesReadmeExist) {
    throw new Error(`Please create a README.adoc file in your '${dir}' directory`);
  }

  const isValidFileNameCharacters = filePaths.every(filePath => {
    const fileName = path.basename(filePath);

    return /^[a-zA-Z0-9-_\.]+$/.test(fileName);
  });

  if (!isValidFileNameCharacters) {
    throw new Error(`Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)`);
  }

  return filePaths || [];
};

export { findDocFiles };