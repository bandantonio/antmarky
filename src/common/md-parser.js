let showdown = require('showdown');
let { markyText } = require('../extensions/text-modifications');
showdown.extension('markyText', markyText);

let md = new showdown.Converter({
  emoji: true,
  ghCodeBlocks: true,
  ghCompatibleHeaderId: true,
  metadata: true,
  parseImgDimension: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  extensions: ['markyText', markyText ]
});

showdown.setFlavor('github');

module.exports = {
  md: md
}