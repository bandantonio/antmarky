import { describe, expect, test } from '@jest/globals';
import * as mock from 'mock-fs';
import * as path from 'path';
import findDocFiles from '../../src/find-files';

describe('module findDocFiles', () => {
  
  describe('default `docs` directory', () => {
    test('Should throw an error when the default `docs` directory does not exist', async () => {
      mock({
        '': {}
      });

      await expect(findDocFiles()).rejects.toThrow(`Looks like the directory '${process.cwd()}/docs' does not exist`);
      mock.restore();
    });

    test('Should throw an error when the default `docs` directory is empty', async () => {
      mock({
        'docs': {}
      });
      
      await expect(findDocFiles()).rejects.toThrow(`Looks like the '${process.cwd()}/docs' directory is empty`);
      mock.restore();
    });
    
    test('Should output an array of expected format after finding file(s)', async () => {
      mock({
        'docs': {
          'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`
        }
      });
      const files = await findDocFiles();
      expect(Array.isArray(files)).toBe(true);
      files.map(obj => {
        if (obj.type === 'file') {
          expect(Object.keys(obj)).toEqual(['name', 'href', 'type']);
        }
        if (obj.type === 'directory') {
          expect(Object.keys(obj)).toEqual(['name', 'href', 'type', 'children']);
        }
      });
      mock.restore();
    });
    
    test('Should processes only files with the .adoc extension', async () => {
      mock({
        'docs': {
          'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`,
          'Fake-html-file-that-should-be-ignored.html': `<h1>Hello world from the fake-html-file-that-should-be-ignored</h1>`,
          'child-directory': {
            'Fake-docs-child-dir-one.adoc': `= Title\nHello world from the fake-child-dir-one file`,
            'Another-fake-html-file-that-should-be-ignored.html': `<h1>Hello world from the another-fake-html-file-that-should-be-ignored</h1>`,
          }
        }
      });
      
      let result = await findDocFiles();
      
      expect(result).toEqual([
        {
          name: 'Fake-docs-dir-one.adoc',
          href: path.resolve(process.cwd(), 'docs', 'Fake-docs-dir-one.adoc'),
          type: 'file'
        },
        {
          name: 'child-directory',
          href: path.resolve(process.cwd(), 'docs', 'child-directory'),
          type: 'directory',
          children: [
            {
              name: 'Fake-docs-child-dir-one.adoc',
              href: path.resolve(process.cwd(), 'docs', 'child-directory', 'Fake-docs-child-dir-one.adoc'),
              type: 'file'
            }
          ]
        }
      ]);
      
      mock.restore();
    });
  });
  
  describe('custom `docs` directory', () => {
    test.skip('Throw an error when the specified docs directory doesn\'t exist (custom `docs` directory)', async () => {
      const dirName = 'nonexistentdirectory';
      await expect(findDocFiles(dirName)).rejects.toThrow(`Looks like the specified directory ${dirName} does not exist`);
    });
    test.todo('Ensure the module outputs an array of expected format (custom `docs` directory)');
    test.todo('Ensure the module outputs an array (custom `docs` directory)');
  });
  describe.skip('root `docs` directory', () => {
    test('Ensure the module outputs an array of expected format (root directory)', async () => {
      const files = await findDocFiles('/');
      files.map(obj => expect(Object.keys(obj)).toEqual(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files']))
    });
    
    test('Ensure the module outputs an array (root directory)', async () => {
      const files = await findDocFiles('/');
      expect(files).toBeInstanceOf(Array);
    });
    
  });
  
  
  
  
  
  //   describe.skip('module findDocFiles - working with files', () => {
  
  //     test('Output files from the root docs directory', async () => {
  //       mock({
  //         'fake-root-one.adoc': `= Title\nHello world from the fake-root-one file`,
  //         'fake-root-two.adoc': `= Title\nHello world from the fake-root-two file`,
  //       });
  
  //       let result = await findDocFiles('/');
  //       expect(result.map(obj => obj.files)).toContainEqual([
  //         { file: 'fake-root-one.adoc', fileName: 'fake-root-one' },
  //         { file: 'fake-root-two.adoc', fileName: 'fake-root-two' }
  //       ])
  
  //       mock.restore();
  //     });
  
  //     test(`Output files from the default docs directory (with child directories)`, async () => {
  //       mock({
  //         'docs': {
  //           'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`,
  //           'Fake-docs-dir-two.adoc': `= Title\nHello world from the fake-docs-dir-two file`,
  //           'child-directory': {
  //             'Fake-docs-child-dir-one.adoc': `= Title\nHello world from the fake-child-dir-one file`,
  //             'Fake-docs-child-dir-two.adoc': `= Title\nHello world from the fake-child-dir-two file`,
  //           }
  //         }
  //       });
  
  //       let result = await findDocFiles();
  
  //       expect(result).toBeInstanceOf(Array);
  //       expect(result).toHaveLength(2);
  //       expect(result[0].dirName).toEqual('Home');
  //       expect(result[1].dirName).toEqual('Child-directory');
  
  //       expect(result[0].files).toEqual(expect.arrayContaining([
  //         { file: 'Fake-docs-dir-one.adoc', fileName: 'Fake-docs-dir-one' },
  //         { file: 'Fake-docs-dir-two.adoc', fileName: 'Fake-docs-dir-two' }
  //       ]));
  //       expect(result[1].files).toEqual(expect.arrayContaining([
  //         { file: 'Fake-docs-child-dir-one.adoc', fileName: 'Fake-docs-child-dir-one' },
  //         { file: 'Fake-docs-child-dir-two.adoc', fileName: 'Fake-docs-child-dir-two' }
  //       ]));
  
  //       mock.restore();
  //     });
  
  //     test(`Should throw an error when passing invalid filename`, async () => {
  //       mock({
  //         'docs': {
  //           'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`,
  //           'child-directory': {
  //             'Very¢£«±Ÿ÷_bad&*()\/<> file-!@#$%^ name.adoc': `= Title\nHello world from the fake-child-dir-one file`
  //           }
  //         }
  //       });
  
  //       await expect(findDocFiles()).rejects.toThrow('Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)');
  
  //       mock.restore();
  //     });
  //   });
});
