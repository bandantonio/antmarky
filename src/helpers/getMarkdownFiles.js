const fs = require('fs');
const path = require('path');

/**
 * Find all Markdown files in directory
 */
const getMarkdownFiles = (dir) => {
  return fs.readdirSync(dir)
    .filter(file => path.extname(file) === '.md')
    .map(file => file.substring(0, file.lastIndexOf('.')));
};

module.exports = getMarkdownFiles;
