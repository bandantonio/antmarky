import * as fs from 'fs';
import * as path from 'path';
import { filenameSchema } from '../schemas/schemas';

export interface FileData {
  file: string,
  fileName: string
}
/**
* Find all Asciidoctor files in directory
*/
export const getDocFiles = (dir:string):FileData[] => {
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
