const mock = require('mock-fs');
const { getFilesContent } = require('../../src/common/prepare-content');

describe('module getFilesContent', () => {
  test('Throw an error when passing input of incorrect type', async () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      await expect(getFilesContent(value)).rejects.toThrow(Error, `Can't get content from files`);
    }
  });
  
  test('Get file details from default docs directory', async () => {
    // Merge this test later with the one below
    mock({
      'docs': {
        'unit-tests.adoc': `= Title\nHello world from the fake-root-one file\nhttps://github.com/bandantonio[link to GitHub]`,
        'asciidoctor.adoc': `= Title\nHello world from the fake-root-two file\nhttps://github.com/bandantonio/antmarky[link to Antmarky]`,
      }
    });
    let content = [{
      dirLevel: 0,
      basePath: `${process.cwd()}/docs`,
      dirPath: '',
      dirClass: 'home',
      dirName: 'Home',
      files: [
        { file: 'unit-tests.adoc', fileName: 'unit-tests' },
        { file: 'asciidoctor.adoc', fileName: 'asciidoctor' }
      ]
    }]
    
    let result = await getFilesContent(content);

    expect(result).toHaveLength(2);

    result.forEach(obj => expect(Object.keys(obj)).toEqual(['name', 'title', 'content']));
    expect(result[0]).toEqual({
      name: { file: 'unit-tests.adoc', fileName: 'unit-tests' },
      title: 'unit-tests',
      content: '= Title\n' + 'Hello world from the fake-root-one file\n' + 'https://github.com/bandantonio[link to GitHub]'
    });
    expect(result[1]).toEqual({
      name: { file: 'asciidoctor.adoc', fileName: 'asciidoctor' },
      title: 'asciidoctor',
      content: '= Title\n' + 'Hello world from the fake-root-two file\n' + 'https://github.com/bandantonio/antmarky[link to Antmarky]'
    });

    mock.restore();
  });

  test.todo('Get file details from default docs directory');
  test.todo('Get file details from root directory');
  test.todo('Get file details from custom docs directory');
});