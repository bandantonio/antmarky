import fs from 'fs';
import mock from 'mock-fs';
import path from 'path';
import { afterEach, describe, expect, test } from 'vitest';
import saveHtmlPages from '../../src/saveHtml';

describe('saveHtml', () => {
    afterEach(() => {
        mock.restore();
    });
    test('Should save HTML files to the `dist` directory', async () => {
        mock({
            'dist': {},
            'src/templates': mock.load(path.resolve('src/templates'))
        })
        let fakeContent = [{
            fileName: 'index',
            fileTitle: 'Index',
            fileDir: process.cwd() + '/docs',
            fileHtmlContent: '',
            tableOfContents: []
        }, {
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
        }, {
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
        }, {
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
        }];

        await saveHtmlPages(fakeContent);

        const outputFolderContents = await fs.promises.readdir(path.resolve('dist'));
        expect(outputFolderContents).toEqual([
            'asciidoctor.html',
            'index.html',
            'unit-tests.html',
            'unit-tests2.html'
        ]);
    });
});