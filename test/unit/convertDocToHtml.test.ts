import { describe, expect, test } from '@jest/globals';
import convertDocToHtml from '../../src/adoc-to-html';

describe('module convertDocToHtml', () => {
  test('Convert content without remote inclusion', () => {
    let content = [{
      name: { file: 'features.adoc', fileName: 'features' },
      title: 'features',
      content: '== Title\nHello world from the fake-root-one file\nhttps://github.com/bandantonio[link to GitHub]'
    },{
      name: { file: 'test-file.adoc', fileName: 'test-file' },
      title: 'test-file',
      content: '== Title\nHello world from the fake-root-two file\nhttps://github.com/bandantonio/antmarky[link to Antmarky]'
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