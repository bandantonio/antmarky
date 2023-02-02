import { describe, expect, test } from '@jest/globals';
import { adoc, asciidoctorDefaultConfig } from '../../src/asciidoc-parser';
import convertDocToHtml from './../../src/convert-adoc-to-html';

describe('module convertDocToHtml', () => {
  test('Convert content', () => {
    let content = [{
      name: 'features.adoc',
      href: 'fake-root-one/features.adoc',
      content: '== Title\nHello world from the fake-root-one file\nhttps://github.com/bandantonio[link to GitHub]'
    },{
      name: 'test-file.adoc', 
      href: 'test-file/test-file.adoc',
      content: '== Title\nHello world from the fake-root-two file\nhttps://github.com/bandantonio/antmarky[link to Antmarky]'
    },{
      name: 'README.adoc', 
      href: './README.adoc',
      content: '== README\nIndex file'
    }];
    
    let result = convertDocToHtml(content);
    expect(result).toHaveLength(3);
    result.forEach(obj => expect(Object.keys(obj)).toEqual(['name', 'title', 'href', 'html']));
    // check that each object has the correct values
    expect(result[0]).toEqual({
      name: 'features.html',
      title: 'Title',
      href: '../fake-root-one/features.html',
      html: adoc.convert(content[0].content, asciidoctorDefaultConfig)
    });
    expect(result[1]).toEqual({
      name: 'test-file.html',
      title: 'Title',
      href: '../test-file/test-file.html',
      html: adoc.convert(content[1].content, asciidoctorDefaultConfig)
    });
    expect(result[2]).toEqual({
      name: 'index.html',
      title: 'README',
      href: '../README.html',
      html: adoc.convert(content[2].content, asciidoctorDefaultConfig)
    });
  });
  test.todo('convert content with remote inclusion');
  test.todo('create mock function to serve remote content');
});