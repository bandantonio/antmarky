import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import defaultSettings from './default-settings';
import { copyStaticAssetsSchema } from './schemas/schemas'
/**
 * Copy source and docs assets to the corresponding directories
 */
const copyStaticAssets = (docsDirectoryName = defaultSettings.docsDirectory) => {
    const staticFolder = defaultSettings.assetsDirectory;
    const validateStaticAssets = copyStaticAssetsSchema.validate(staticFolder);
  
    if (!validateStaticAssets.error) {
      fse.copySync(path.resolve(path.join(process.cwd() + '/src/' + staticFolder)), path.resolve(defaultSettings.outputDirectory));
    }
  
    const docsStaticFolderPath = path.join(path.resolve(docsDirectoryName), staticFolder);
    const publicStaticFolderPath = path.join(path.resolve(defaultSettings.outputDirectory), staticFolder);
  
    if (fs.existsSync(docsStaticFolderPath)) {
      fse.copySync(docsStaticFolderPath, publicStaticFolderPath);
    }
};

export default copyStaticAssets;