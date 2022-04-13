const fs = require('fs');
const path = require('path');

/**
 * Check directory for possible child directories
 */
const checkForChildrenFolders = (dir) => {
  const items = fs.readdirSync(dir);
  return items.filter(item => {
    return path.join(dir, item).match(/^(?!.*\/\.|.*node_modules).*$/gi);
  }).filter(item => {
    return fs.lstatSync(path.join(dir, item)).isDirectory();
  });
};

module.exports = checkForChildrenFolders;
