import * as path from 'path';
import {
  createDirectory,
  cleanDirectoryContents,
  copyDirectoryContentsToDestination,
  directoryExists } from './helpers/directoryActions';
import defaultSettings from './default-settings';
import { copyStaticAssetsSchema } from './schemas/schemas'

const copyStaticAssets = async () => {
  const outputDirectory = defaultSettings.outputDirectory;
  const outputDirectoryPath = path.resolve(outputDirectory);
  
  // before copying static assets, check if the output directory exists
  // if it doesn't, create it
  const doesOutputDirectoryExist = await directoryExists(outputDirectoryPath);
  if (!doesOutputDirectoryExist) {
    try {
      await createDirectory(outputDirectoryPath);
    } catch (err) {
      throw err;
    }
  }
  // if it does, clean it
  await cleanDirectoryContents(outputDirectoryPath);

  await copySystemAssets();
  await copyUserAssets();
};

async function copySystemAssets() {
  const outputDirectory = defaultSettings.outputDirectory;
  const outputDirectoryPath = path.resolve(outputDirectory);
  
  // check if the system static assets directory corresponds to a valid path
  // if it does, copy it to the output directory
  const validateStaticAssets = copyStaticAssetsSchema.validate(defaultSettings.assetsDirectory);  
  
  if (!validateStaticAssets.error) {
    const systemAssetsDirectoryPath = path.resolve(defaultSettings.assetsDirectory);
    try {
      await copyDirectoryContentsToDestination(systemAssetsDirectoryPath, outputDirectoryPath);
    } catch (err) {
      throw err;
    }
  }
}

async function copyUserAssets() {
  const outputDirectory = defaultSettings.outputDirectory;
  const docsDirectory = defaultSettings.docsDirectory;
  const userAssetsDirectory = defaultSettings.userStaticAssetsDirectory;

  // check if the user static assets directory exists
  // if it does, copy it to the output directory
  // if it doesn't, no actions required as the user may not have any static assets
  let userAssetsDirectoryPath = path.resolve(docsDirectory, userAssetsDirectory);
  let doesUserAssetsDirectoryExist = await directoryExists(userAssetsDirectoryPath);
  
  if (doesUserAssetsDirectoryExist) { 
    const userAssetsDirectoryOutputPath = path.resolve(outputDirectory, userAssetsDirectory);

    try {
      await createDirectory(userAssetsDirectoryOutputPath);
      await copyDirectoryContentsToDestination(userAssetsDirectoryPath, userAssetsDirectoryOutputPath);
    } catch (err) {
      throw err;     
    }
  }
}

export default copyStaticAssets;