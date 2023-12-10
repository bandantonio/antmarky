import { glob } from 'glob';
import path from 'path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as directoryActions from '../../src/helpers/directoryActions';
import { findDocFiles } from '../../src/findFiles';
import config from '../../src/config/defaultConfiguration';

describe('findFiles', () => {
    beforeEach(() => {
        vi.mock('glob', async () => {
            return {
                glob: vi.fn()
            }
        });
    });
    afterEach(() => {
        vi.doUnmock('glob');
    });

    test('Should throw an error when the default `docs` directory does not exist', async () => {
        vi.spyOn(directoryActions, 'doesDirectoryExist').mockResolvedValue(false);

        await expect(findDocFiles()).rejects.toThrow(`Looks like the 'docs' directory does not exist`);
    });

    test('Should throw an error when the default `docs` directory is empty', async () => {
        vi.spyOn(directoryActions, 'doesDirectoryExist').mockResolvedValue(true);
        vi.mocked(glob).mockResolvedValue([]);

        await expect(findDocFiles()).rejects.toThrow(`Looks like the 'docs' directory is empty`);
    });

    test('Should throw an error when there is no README.adoc file in the default `docs` directory', async () => {
        vi.spyOn(directoryActions, 'doesDirectoryExist').mockResolvedValue(true);
        vi.mocked(glob).mockResolvedValue([
            path.join(process.cwd(), 'docs', 'mock1.adoc'),
            path.join(process.cwd(), 'docs', 'sub', 'mock-two.adoc')
        ]);

        await expect(findDocFiles()).rejects.toThrow(`Please create a README.adoc file in your 'docs' directory`);
    });

    test('Should output an array with paths to files after searching a directory', async () => {
        vi.spyOn(directoryActions, 'doesDirectoryExist').mockResolvedValue(true);

        const expectedListOfFiles = [
            path.join(config.docsDirectory, 'README.adoc'),
            path.join(config.docsDirectory, 'apple1.adoc'),
            path.join(config.docsDirectory, 'sub', 'google-two.adoc'),
            path.join(config.docsDirectory, 'sub', 'sub-folder', 'microsoft_three.adoc'),
            path.join(config.docsDirectory, 'sub', 'sub-folder', 'sub-sub-folder', 'netflix.four.adoc')
        ];

        vi.mocked(glob).mockResolvedValue(expectedListOfFiles);

        let files = await findDocFiles();

        expect(files).toHaveLength(5);
        expect(files).toEqual(expectedListOfFiles);
    });

    test('Should return only files with the .adoc extension', async () => {
        vi.spyOn(directoryActions, 'doesDirectoryExist').mockResolvedValue(true);
        vi.mocked(config).docsDirectory = path.join('test', 'snapshots', 'src');

        let filePaths = await findDocFiles();

        expect(filePaths).not.toContain(path.join('test', 'snapshots', 'src', 'ignored-mock.ts'));

    });

    test(`Should throw an error when passing invalid filename`, async () => {
        vi.spyOn(directoryActions, 'doesDirectoryExist').mockResolvedValue(true);

        const expectedListOfFiles = [
            path.join(process.cwd(), 'docs', 'README.adoc'),
            path.join(process.cwd(), 'docs', 'sub', 'Very¢£«±Ÿ÷_bad&*()/<> file-!@#$%^ name.adoc')
        ];

        vi.mocked(glob).mockResolvedValue(expectedListOfFiles);

        await expect(findDocFiles()).rejects.toThrow(
            'Filename is invalid. Valid characters are: letters (A-Z, a-z), numbers (0-9), dashes (-), underscores (_), dots (.)'
        );
    });
});