const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mock = require('mock-fs');
const { getFilesContent } = require('../../src/common/prepare-content');
chai.use(chaiAsPromised);

describe('module getFilesContent', () => {
  it('Throw an error when passing input of incorrect type', async () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      await expect(getFilesContent(value)).to.be.rejectedWith(`Can't get content from Markdown files`);
    }
  });
  
  it('Get file details from default docs directory', async () => {
    // Merge this test later with the one below
    mock({
      'docs': {
        'unit-tests.md': `# Title\nHello world from the fake-root-one file\n[link to GitHub](https://github.com/bandantonio)`,
        'markdown.md': `# Title\nHello world from the fake-root-two file\n[link to Antmarky](https://github.com/bandantonio/antmarky)`,
      }
    });
    let content = [{ dirLevel: 0, basePath: `${process.cwd()}/docs`, dirPath: '', dirClass: 'home', dirName: 'Home', files: [ 'unit-tests', 'markdown' ] }]
    
    let result = await getFilesContent(content);

    expect(result).length.to.be(2);
    result.forEach(obj => expect(obj).to.include.all.keys('name', 'title', 'content'));
    expect(result[0]).to.eql({
      name: 'unit-tests',
      title: 'unit-tests',
      content: '# Title\n' + 'Hello world from the fake-root-one file\n' + '[link to GitHub](https://github.com/bandantonio)'
    });
    expect(result[1]).to.eql({
      name: 'markdown',
      title: 'markdown',
      content: '# Title\n' + 'Hello world from the fake-root-two file\n' + '[link to Antmarky](https://github.com/bandantonio/antmarky)'
    });

    mock.restore();
  });

  it('Get file details from default docs directory')
  it('Get file details from root directory')
  it('Get file details from custom docs directory')
});