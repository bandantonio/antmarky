const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { convertMdToHtml } = require('../../src/common/prepare-content');
chai.use(chaiAsPromised);

describe('module convertMdToHtml', () => {
  it('Ensure the module throws an error when passing input of incorrect type', () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      expect(() => convertMdToHtml(value)).to.throw('Can\'t convert. Input data is invalid');
    }
  });

  it('convert content without remote inclusion', () => {
    let content = [{
      name: 'features',
      title: 'features',
      content: '# Title\nHello world from the fake-root-one file\n[link to GitHub](https://github.com/bandantonio)'
    },{
      name: 'markdown',
      title: 'markdown',
      content: '# Title\nHello world from the fake-root-two file\n[link to Antmarky](https://github.com/bandantonio/antmarky)'
    }];

    let result = convertMdToHtml(content);
    expect(result).to.have.length(2);
    result.forEach(obj => expect(obj).to.include.all.keys('name', 'title', 'html', 'toc'));
  });
  it.skip('convert content with remote inclusion')
  it.skip('create mock function to serve remote content')
});