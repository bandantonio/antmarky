import * as fs from 'fs';
import * as path from 'path';

/**
 * Check directory for possible child directories
 */
const checkForChildrenFolders = (dir:string):string[] => {
  const items = fs.readdirSync(dir);
  return items.filter(item => {
    return path
      .join(dir, item)
      .match(/^(?!.*\/\.|.*node_modules).*$/gi);
  }).filter(item => fs
    .lstatSync(path.join(dir, item))
    .isDirectory());
};

export default checkForChildrenFolders;
