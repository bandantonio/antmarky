import fse from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import config from './config/defaultConfiguration';

const saveStaticAssets = async () => {
    const assetsList = await glob(path.join(config.docsDirectory, '/**/*.{png,jpg,jpeg,svg,mp4}'), { ignore: '**/node_modules/**' });

    try {
        for await (let asset of assetsList) {
            const relativePathToAsset = path.relative(config.docsDirectory, asset);
            console.log('copying...');

            fse.copy(asset, path.join(config.outputDirectory, relativePathToAsset));
        }
    } catch (error) {
        throw new Error(`Cannot copy the assets to the output directory: '${config.outputDirectory}'`);
    }
};

export default saveStaticAssets;