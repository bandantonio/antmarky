import { describe, expect, test } from '@jest/globals';
import * as mock from 'mock-fs';
import getFileContent from '../../src/get-file-content';
import { ItemsList } from '../../src/interfaces/ItemDetails';

describe('module getFileContent', () => {  
  test('Get file details from default `docs` directory', async () => {
    // Merge this test later with the one below
    mock({
      'docs': {
        'unit-tests.adoc': `= Title\nHello world from the fake-root-one file\nhttps://github.com/bandantonio[link to GitHub]`,
        'asciidoctor.adoc': `= Title\nHello world from the fake-root-two file\nhttps://github.com/bandantonio/antmarky[link to Antmarky]`,
        'sub-folder': {
          'unit-tests2.adoc': `= Title\nHello world from the fake-root-three file\nhttps://github.com/bandantonio/antmarky[link to Antmarky]`
        }
      }
    });
    
    let content:ItemsList[] = [{
      name: 'unit-tests.adoc',
      href: `${process.cwd()}/docs/unit-tests.adoc`,
      type: 'file'
    },{
      name: 'asciidoctor.adoc',
      href: `${process.cwd()}/docs/asciidoctor.adoc`,
      type: 'file'
    },{
      name: 'sub-folder',
      href: `${process.cwd()}/docs/sub-folder`,
      type: 'directory',
      children: [{
        name: 'unit-tests2.adoc',
        href: `${process.cwd()}/docs/sub-folder/unit-tests2.adoc`,
        type: 'file'
      }]
    }];
    
    let result = await getFileContent(content);
    
    expect(result).toHaveLength(3);
    result.forEach(obj => expect(Object.keys(obj)).toEqual(['name', 'href', 'content']));
    // check that each object has the correct values
    expect(result[0]).toEqual({
      name: 'unit-tests.adoc',
      href: `${process.cwd()}/docs/unit-tests.adoc`,
      content: '= Title\n' + 'Hello world from the fake-root-one file\n' + 'https://github.com/bandantonio[link to GitHub]'
    });
    expect(result[1]).toEqual({
      name: 'asciidoctor.adoc',
      href: `${process.cwd()}/docs/asciidoctor.adoc`,
      content: '= Title\n' + 'Hello world from the fake-root-two file\n' + 'https://github.com/bandantonio/antmarky[link to Antmarky]'
    });
    expect(result[2]).toEqual({
      name: 'unit-tests2.adoc',
      href: `${process.cwd()}/docs/sub-folder/unit-tests2.adoc`,
      content: '= Title\n' + 'Hello world from the fake-root-three file\n' + 'https://github.com/bandantonio/antmarky[link to Antmarky]'
    });
    
    mock.restore();
  });
  
  test.todo('Get file details from root directory');
  test.todo('Get file details from custom docs directory');
});