import { afterEach, describe, expect, test } from 'vitest';
import findDocFiles from '../../src/findFiles';
import mock from 'mock-fs';

describe('findFiles', () => {
    afterEach(() => {
        mock.restore();
    });

    test('Should throw an error when the default `docs` directory does not exist', async () => {
        mock({
            '': {}
        });

        await expect(findDocFiles()).rejects.toThrow(`Looks like the directory 'docs' does not exist`);
    });

    test('Should throw an error when the default `docs` directory is empty', async () => {
        mock({
            'docs': {}
        });

        await expect(findDocFiles()).rejects.toThrow(`Looks like the 'docs' directory is empty`);
    });

    test('Should output an array with paths to files after searching a directory', async () => {
        mock({
            'docs': {
                'README.adoc': '= Just a README file\n\nHello world',
                'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`
            }
        });
        let files = await findDocFiles();

        expect(Array.isArray(files)).toBe(true);
        expect(files).toHaveLength(2);
        expect(files).toEqual([
            'docs/README.adoc',
            'docs/Fake-docs-dir-one.adoc'
        ]);
    });

    test('Should return only files with the .adoc extension', async () => {
        mock({
            'docs': {
                'README.adoc': '= Just a README file\n\nHello world',
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
            'docs/README.adoc',
            'docs/Fake-docs-dir-one.adoc',
            'docs/child-directory/Fake-docs-child-dir-one.adoc',
        ]);
    });

    test.todo(`Should throw an error when passing invalid filename`, async () => {
        //       mock({
        //         'docs': {
        //           'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`,
        //           'child-directory': {
        //             'Very¢£«±Ÿ÷_bad&*()\/<> file-!@#$%^ name.adoc': `= Title\nHello world from the fake-child-dir-one file`
        //           }
        //         }
        //       });

        //       await expect(findDocFiles()).rejects.toThrow('Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)');

        //   
    });

    test('Should throw an error when there is no README.adoc file in the default `docs` directory', async () => {
        mock({
            'docs': {
                'Fake-docs-dir-one.adoc': `= Title\nHello world from the fake-docs-dir-one file`
            }
        });

        await expect(findDocFiles()).rejects.toThrow(`Please create a README.adoc file in your 'docs' directory`);
    });
});