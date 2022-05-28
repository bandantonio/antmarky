const mock = require('mock-fs');
const { getFilesContent } = require('../../src/common/prepare-content');

describe('module getFilesContent', () => {
  test('Throw an error when passing input of incorrect type', async () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      await expect(getFilesContent(value)).rejects.toThrow(Error, `Can't get content from Markdown files`);
    }
  });
  
  test('Get file details from default docs directory', async () => {
    // Merge this test later with the one below
    mock({
      'docs': {
        'unit-tests.md': `# Title\nHello world from the fake-root-one file\n[link to GitHub](https://github.com/bandantonio)`,
        'markdown.md': `# Title\nHello world from the fake-root-two file\n[link to Antmarky](https://github.com/bandantonio/antmarky)`,
      }
    });
    let content = [{ dirLevel: 0, basePath: `${process.cwd()}/docs`, dirPath: '', dirClass: 'home', dirName: 'Home', files: [ 'unit-tests', 'markdown' ] }]
    
    let result = await getFilesContent(content);

    expect(result).toHaveLength(2);

    result.forEach(obj => expect(Object.keys(obj)).toEqual(['name', 'title', 'content']));
    expect(result[0]).toEqual({
      name: 'unit-tests',
      title: 'unit-tests',
      content: '# Title\n' + 'Hello world from the fake-root-one file\n' + '[link to GitHub](https://github.com/bandantonio)'
    });
    expect(result[1]).toEqual({
      name: 'markdown',
      title: 'markdown',
      content: '# Title\n' + 'Hello world from the fake-root-two file\n' + '[link to Antmarky](https://github.com/bandantonio/antmarky)'
    });

    mock.restore();
  });

  test.todo('Get file details from default docs directory');
  test.todo('Get file details from root directory');
  test.todo('Get file details from custom docs directory');
});