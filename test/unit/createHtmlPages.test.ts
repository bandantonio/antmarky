import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import * as mock from 'mock-fs';
import { processContent } from '../../src/process-content';
import createHtmlPages from '../../src/create-html-pages';
import copyStaticAssets from '../../src/copy-assets';
import { directoryExists } from '../../src/helpers/directoryActions';

describe('module createHtmlPages', () => {  
  test('Ensure the output directory contains generated static files (README in the default docs directory)', async () => {
    mock({
      'docs': {
        'unit-test.adoc': '== Unit test 1\nUnit test 1 file content',
        'unit-test-2.adoc': '== Unit test 2\nUnit test 2 file content',
        'README.adoc': '== Index\nIndex file content',
      },
      'docs/unit-sub-dir': {
        'unit-test-3.adoc': '== Unit test 3\nUnit test 3 file content'
      },
      'src/views': mock.load(path.resolve('src/views')),
      'src/assets': mock.load(path.resolve('src/assets')),
      
      'public': {}
    });
    
    await copyStaticAssets();
    let htmlContent = await processContent();
    await createHtmlPages(htmlContent);
    await expect(mock.bypass(() => directoryExists(path.resolve('public')))).resolves.toBeFalsy();
    await expect(fs.promises.readdir('public')).resolves.toBeInstanceOf(Array);
    await expect(fs.promises.readdir('public')).resolves.toEqual(expect.arrayContaining(['css']));
    await expect(fs.promises.readdir('public')).resolves.toEqual(expect.arrayContaining(['css', 'index.html', 'unit-test.html', 'unit-test-2.html', 'unit-test-3.html', '404.html']));
    await expect(fs.promises.readdir('public')).resolves.toEqual(expect.not.arrayContaining(['unit-test-4.html']));
    
    mock.restore();
  });

  // TODO: Fix this test
  // mock-fs cannot mock the fs.promises.cp. Issue: https://github.com/tschaub/mock-fs/issues/358
  test.todo('Ensure assets in the default docs directory are copied to the output directory');
});
