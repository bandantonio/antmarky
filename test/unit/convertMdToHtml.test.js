const { convertMdToHtml } = require('../../src/common/prepare-content');

describe('module convertMdToHtml', () => {
  test('Ensure the module throws an error when passing input of incorrect type', () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      expect(() => convertMdToHtml(value)).toThrowError('Can\'t convert. Input data is invalid');
    }
  });

  test('Convert content without remote inclusion', () => {
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
    expect(result).toHaveLength(2);
    result.forEach(obj => expect(Object.keys(obj)).toEqual(['name', 'title', 'html', 'toc']));
  });
  test.todo('convert content with remote inclusion');
  test.todo('create mock function to serve remote content');
});