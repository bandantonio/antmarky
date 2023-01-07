import * as fs from 'fs';
import * as path from 'path';
import defaultSettings from './default-settings';
import { saveHtmlContentSchemaFile, saveHtmlContentSchemaContent } from './schemas/schemas'

/**
 * Save HTML content to a file
 */
const saveHtmlContent = async (filename:string, htmlContent:string, outputDirectory = defaultSettings.outputDirectory) => {
    await saveHtmlContentSchemaFile.validateAsync(filename);
    await saveHtmlContentSchemaContent.validateAsync(htmlContent);
    const basePath = path.join(process.cwd(), outputDirectory);
  
    await fs.promises.mkdir(basePath, { recursive: true });
    await fs.promises.writeFile(path.join(basePath, filename), htmlContent);
};

export default saveHtmlContent;