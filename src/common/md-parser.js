const showdown = require('showdown');
const { markyText } = require('../extensions/text-modifications');
showdown.extension('markyText', markyText);

const md = new showdown.Converter({
  emoji: true,
  ghCodeBlocks: true,
  ghCompatibleHeaderId: true,
  metadata: true,
  parseImgDimension: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  extensions: ['markyText', markyText]
});

showdown.setFlavor('github');

module.exports = {
  md: md
};
