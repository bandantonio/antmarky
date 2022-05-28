const mock = require('mock-fs');
const { findMdFiles } = require('../../src/common/prepare-content');

describe('module findMdFiles', () => {

  test('Ensure the module outputs an array (default `docs` directory)', async () => {
    const files = await findMdFiles();
    expect(files).toBeInstanceOf(Array);
  })
  
  test.todo('Ensure the module outputs an array (custom `docs` directory');
  
  test('Ensure the module outputs an array (root directory)', async () => {
    const files = await findMdFiles('/');
    expect(files).toBeInstanceOf(Array);
  });

  test('Ensure the module outputs an array of expected format (default `docs` directory)', async () => {
    const files = await findMdFiles();
    files.map(obj => expect(Object.keys(obj)).toEqual(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files']));
  });

  test.todo('Ensure the module outputs an array of expected format (custom `docs` directory)');

  test('Ensure the module outputs an array of expected format (root directory)', async () => {
    const files = await findMdFiles('/');
    files.map(obj => expect(Object.keys(obj)).toEqual(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files']))
  });

  test('Throw an error when docs directory name is invalid', async () => {
    await expect(findMdFiles(123)).rejects.toThrow(Error, 'Invalid docs directory');
  });

  test(`Throw an error when the specified docs directory doesn't exist`, async () => {
    await expect(findMdFiles('nonexistentdirectory')).rejects.toThrow(Error, 'The specified directory does not exist');
  });

  describe('module findMdFiles - working with files', () => {

    test('Output files from the root docs directory', async () => {
      mock({
        'fake-root-one.md': `# Title\nHello world from the fake-root-one file`,
        'fake-root-two.md': `# Title\nHello world from the fake-root-two file`,
      });

      let result = await findMdFiles('/');
      expect(result.map(obj => obj.files)).toContainEqual(['fake-root-one', 'fake-root-two'])
      
      mock.restore();
    });
    
    test(`Output files from the default docs directory (with child directories)`, async () => {
      mock({
        'docs': {
          'Fake-docs-dir-one.md': `# Title\nHello world from the fake-docs-dir-one file`,
          'Fake-docs-dir-two.md': `# Title\nHello world from the fake-docs-dir-two file`,
          'child-directory': {
            'Fake-docs-child-dir-one.md': `# Title\nHello world from the fake-child-dir-one file`,
            'Fake-docs-child-dir-two.md': `# Title\nHello world from the fake-child-dir-two file`,
          }
        }
      });

      let result = await findMdFiles();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0].dirName).toEqual('Home');
      expect(result[1].dirName).toEqual('Child-directory');

      expect(result[0].files).toEqual(expect.arrayContaining(['Fake-docs-dir-one', 'Fake-docs-dir-two']));
      expect(result[1].files).toEqual(expect.arrayContaining(['Fake-docs-child-dir-one', 'Fake-docs-child-dir-two']));

      mock.restore();
    });

    test(`Should throw an error when passing invalid filename`, async () => {
      mock({
        'docs': {
          'Fake-docs-dir-one.md': `# Title\nHello world from the fake-docs-dir-one file`,
          'child-directory': {
            'Very¢£«±Ÿ÷_bad&*()\/<> file-!@#$%^ name.md': `# Title\nHello world from the fake-child-dir-one file`
          }
        }
      });

      await expect(findMdFiles()).rejects.toThrow(Error, 'Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)');

      mock.restore();
    });
  });
});
