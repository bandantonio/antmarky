import { describe, expect, test } from '@jest/globals';
import * as mock from 'mock-fs';
import { findDocFiles } from '../../src/common/prepare-content';

describe('module findDocFiles', () => {

  test('Ensure the module outputs an array (default `docs` directory)', async () => {
    const files = await findDocFiles();
    expect(files).toBeInstanceOf(Array);
  })
  
  test.todo('Ensure the module outputs an array (custom `docs` directory');
  
  test('Ensure the module outputs an array (root directory)', async () => {
    const files = await findDocFiles('/');
    expect(files).toBeInstanceOf(Array);
  });

  test('Ensure the module outputs an array of expected format (default `docs` directory)', async () => {
    const files = await findDocFiles();
    files.map(obj => expect(Object.keys(obj)).toEqual(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files']));
  });

  test.todo('Ensure the module outputs an array of expected format (custom `docs` directory)');

  test('Ensure the module outputs an array of expected format (root directory)', async () => {
    const files = await findDocFiles('/');
    files.map(obj => expect(Object.keys(obj)).toEqual(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files']))
  });

  test(`Throw an error when the specified docs directory doesn't exist`, async () => {
    const dirName = 'nonexistentdirectory';
    await expect(findDocFiles(dirName)).rejects.toThrow(`Looks like the specified directory ${dirName} does not exist`);
  });

  describe('module findDocFiles - working with files', () => {

    test('Output files from the root docs directory', async () => {
      mock({
        'fake-root-one.adoc': `= Title\nHello world from the fake-root-one file`,
        'fake-root-two.adoc': `= Title\nHello world from the fake-root-two file`,
      });

      let result = await findDocFiles('/');
      expect(result.map(obj => obj.files)).toContainEqual([
        { file: 'fake-root-one.adoc', fileName: 'fake-root-one' },
        { file: 'fake-root-two.adoc', fileName: 'fake-root-two' }
      ])
      
      mock.restore();
    });
    
    test(`Output files from the default docs directory (with child directories)`, async () => {
      mock({
        'docs': {
          'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`,
          'Fake-docs-dir-two.adoc': `= Title\nHello world from the fake-docs-dir-two file`,
          'child-directory': {
            'Fake-docs-child-dir-one.adoc': `= Title\nHello world from the fake-child-dir-one file`,
            'Fake-docs-child-dir-two.adoc': `= Title\nHello world from the fake-child-dir-two file`,
          }
        }
      });

      let result = await findDocFiles();

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0].dirName).toEqual('Home');
      expect(result[1].dirName).toEqual('Child-directory');

      expect(result[0].files).toEqual(expect.arrayContaining([
        { file: 'Fake-docs-dir-one.adoc', fileName: 'Fake-docs-dir-one' },
        { file: 'Fake-docs-dir-two.adoc', fileName: 'Fake-docs-dir-two' }
      ]));
      expect(result[1].files).toEqual(expect.arrayContaining([
        { file: 'Fake-docs-child-dir-one.adoc', fileName: 'Fake-docs-child-dir-one' },
        { file: 'Fake-docs-child-dir-two.adoc', fileName: 'Fake-docs-child-dir-two' }
      ]));

      mock.restore();
    });

    test(`Should throw an error when passing invalid filename`, async () => {
      mock({
        'docs': {
          'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`,
          'child-directory': {
            'Very¢£«±Ÿ÷_bad&*()\/<> file-!@#$%^ name.adoc': `= Title\nHello world from the fake-child-dir-one file`
          }
        }
      });

      await expect(findDocFiles()).rejects.toThrow('Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)');

      mock.restore();
    });
  });
});
