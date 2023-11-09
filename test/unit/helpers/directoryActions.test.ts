import fs from 'fs';
import mock from 'mock-fs';
import path from 'path';
import { afterEach, describe, expect, test } from 'vitest';
import { doesDirectoryExist, emptyDirectory } from '../../../src/helpers/directoryActions';

describe('directoryActions', () => {
    afterEach(() => {
        mock.restore();
    });

    describe('emptyDirectory', async () => {
        test('Should successfully empty the default output directory', async () => {
            mock({
                'dist': {
                    'README.adoc': '= Just a README file',
                    'unit-tests.adoc': `= Title\n\nHello world from the fake-root-one file`
                }
            });

            const pathToOutputDirectory = path.resolve('dist');

            await expect(fs.promises.readdir(pathToOutputDirectory)).resolves.toEqual(['README.adoc', 'unit-tests.adoc']);
            await emptyDirectory(pathToOutputDirectory);
            await expect(fs.promises.readdir(pathToOutputDirectory)).resolves.toEqual([]);
        });

        test('Should throw an error while attempting to empty the default output directory', async () => {
            mock({
                'dist': mock.directory({
                    mode: 0o444,
                    items: {
                        'README.adoc': '= Just a README file',
                        'unit-tests.adoc': `= Title\n\nHello world from the fake-root-one file`
                    }
                })
            });

            const pathToOutputDirectory = path.resolve('dist');

            await expect(fs.promises.readdir(pathToOutputDirectory)).resolves.toEqual(['README.adoc', 'unit-tests.adoc']);
            await expect(emptyDirectory(pathToOutputDirectory)).rejects.toThrow(`Cannot empty the directory: '${pathToOutputDirectory}'`);
        });
    });

    describe('doesDirectoryExist', async () => {
        afterEach(() => {
            mock.restore();
        });

        test('Should return true when the default `docs` directory does exist', async () => {
            mock({
                'docs': {
                    'README.adoc': '= Just a README file'
                }
            });

            const pathToDocsDirectory = path.resolve('docs');

            await expect(doesDirectoryExist(pathToDocsDirectory)).resolves.toBe(true);
            await expect(fs.promises.readdir(pathToDocsDirectory)).resolves.toEqual(['README.adoc']);
        });

        test('Should return false when the default `docs` directory does not exist', async () => {
            mock({
                '': {}
            });

            await expect(doesDirectoryExist(path.resolve('docs'))).resolves.toBe(false);
        });
    });
});