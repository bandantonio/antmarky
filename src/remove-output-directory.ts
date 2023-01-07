import * as fse from 'fs-extra';
import * as path from 'path';
import defaultSettings from './default-settings';
import { removeOutputDirectorySchema } from './schemas/schemas'

const removeOutputDirectory = (outputDirectory: string) => {    
    const validateOutputDirectory = removeOutputDirectorySchema.validate(outputDirectory);
    
    if (validateOutputDirectory.error) {
        throw Error(`Error occurred when deleting the output directory: ${validateOutputDirectory.error.message}`);
    }
    fse.emptyDirSync(path.resolve(outputDirectory));
};

export default removeOutputDirectory;