const fs = require('fs');
const path = require('path');
const { filenameSchema } = require('../schemas/schemas');

/**
* Find all Markdown files in directory
*/
const getMarkdownFiles = (dir) => {
  return fs.readdirSync(dir)
    .filter(file => path.extname(file) === '.md')
    .map(file => {
      const validation = filenameSchema.validate(file);

      if (validation.error) {
        throw new Error('Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)');
      }

      return file.substring(0, file.lastIndexOf('.'));
    });
};

module.exports = getMarkdownFiles;
