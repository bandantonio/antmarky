import mock from 'mock-fs';
import { afterEach, describe, expect, test } from 'vitest';
import getDocFileContent from '../../src/getContent';

describe('getContent', () => {
    afterEach(() => {
        mock.restore();
    });

    test.todo('Should check that a file do contain an asciidoctor-formatted content');
    test('Should get file details from default `docs` directory', async () => {
        mock({
            'docs': {
                'README.adoc': '= Just a README file',
                'unit-tests.adoc': `= Title\n\n== Heading for toc\n\nHello world from the fake-root-one file\n\nhttps://github.com/bandantonio[link to GitHub]`,
                'asciidoctor.adoc': `= Title\n\nHello world from the fake-root-two file\n\nhttps://github.com/bandantonio/antmarky[link to Antmarky]`,
                'sub-folder': {
                    'unit-tests2.adoc': `= Title\n\nHello world from the *fake-root-three file*\n\nhttps://github.com/bandantonio/antmarky[link to Antmarky]`
                }
            }
        });

        let files: string[] = [
            'docs/README.adoc',
            'docs/unit-tests.adoc',
            'docs/asciidoctor.adoc',
            'docs/sub-folder/unit-tests2.adoc'
        ];

        let result = await getDocFileContent(files);

        expect(result).toHaveLength(4);
        result.forEach(obj => expect(Object.keys(obj)).toEqual([
            'fileName',
            'fileTitle',
            'fileDir',
            'fileHtmlContent',
            'tableOfContents'
        ]));
        expect(result[0]).toEqual({
            fileName: 'asciidoctor',
            fileTitle: 'Asciidoctor',
            fileDir: process.cwd() + '/docs',
            fileHtmlContent: '<div class="paragraph">\n' +
                '<p>Hello world from the fake-root-two file</p>\n' +
                '</div>\n' +
                '<div class="paragraph">\n' +
                '<p><a href="https://github.com/bandantonio/antmarky">link to Antmarky</a></p>\n' +
                '</div>',
            tableOfContents: []
        });
        expect(result[1]).toEqual({
            fileName: 'index',
            fileTitle: 'Index',
            fileDir: process.cwd() + '/docs',
            fileHtmlContent: '',
            tableOfContents: []
        });
        expect(result[2]).toEqual({
            fileName: 'unit-tests',
            fileTitle: 'Unit-Tests',
            fileDir: process.cwd() + '/docs',
            fileHtmlContent: '<div class="sect1">\n' +
                '<h2 id="heading-for-toc"><a class="anchor" href="#heading-for-toc"></a>Heading for toc</h2>\n' +
                '<div class="sectionbody">\n' +
                '<div class="paragraph">\n' +
                '<p>Hello world from the fake-root-one file</p>\n' +
                '</div>\n' +
                '<div class="paragraph">\n' +
                '<p><a href="https://github.com/bandantonio">link to GitHub</a></p>\n' +
                '</div>\n' +
                '</div>\n' +
                '</div>',
            tableOfContents: [{
                id: 'heading-for-toc',
                level: 1,
                title: 'Heading for toc'
            }]
        });
        expect(result[3]).toEqual({
            fileName: 'unit-tests2',
            fileTitle: 'Unit-Tests2',
            fileDir: process.cwd() + '/docs/sub-folder',
            fileHtmlContent: '<div class="paragraph">\n' +
                '<p>Hello world from the <strong>fake-root-three file</strong></p>\n' +
                '</div>\n' +
                '<div class="paragraph">\n' +
                '<p><a href="https://github.com/bandantonio/antmarky">link to Antmarky</a></p>\n' +
                '</div>',
            tableOfContents: []
        });
    });
});