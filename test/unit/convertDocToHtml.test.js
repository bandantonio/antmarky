const { convertDocToHtml } = require('../../src/common/prepare-content');

describe('module convertDocToHtml', () => {
  test('Ensure the module throws an error when passing input of incorrect type', () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      expect(() => convertDocToHtml(value)).toThrowError('Can\'t convert. Input data is invalid');
    }
  });

  test('Convert content without remote inclusion', () => {
    let content = [{
      name: { file: 'features.md', fileName: 'features' },
      title: 'features',
      content: '# Title\nHello world from the fake-root-one file\n[link to GitHub](https://github.com/bandantonio)'
    },{
      name: { file: 'markdown.md', fileName: 'markdown' },
      title: 'markdown',
      content: '# Title\nHello world from the fake-root-two file\n[link to Antmarky](https://github.com/bandantonio/antmarky)'
    }];

    let result = convertDocToHtml(content);
    expect(result).toHaveLength(2);
    result.forEach(obj => expect(Object.keys(obj)).toEqual(['name', 'title', 'html', 'toc']));
  });
  test.todo('convert content with remote inclusion');
  test.todo('create mock function to serve remote content');

  test('Convert Asciidoctor content', () => {
    let content = [{
      name: { file: 'features.adoc', fileName: 'features' },
      title: 'features',
      content: '== Hello\n_Hello, Asciidoctor_'
    }];

    let result = convertDocToHtml(content);
    expect(result).toHaveLength(1);
    result.forEach(obj => expect(Object.keys(obj)).toEqual(['name', 'title', 'html', 'toc']));
  });
});