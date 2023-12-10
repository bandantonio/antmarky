import path from 'path';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import getDocFileContent from '../../src/getContent';
import expectedFileContent from '../snapshots/mockedFilesContents';
import config from '../../src/config/defaultConfiguration';

describe('getContent', () => {
    beforeEach(() => {
        vi.mock('../../src/config/defaultConfiguration', () => {
            const actual = vi.importActual('../../src/config/defaultConfiguration');
            return {
                default: {
                    ...actual,
                    docsDirectory: path.join('test', 'snapshots', 'src')
                }
            };
        });
    });

    test('Should check that README file (if exists) becomes the index page', async () => {

        const expectedListOfFiles = [
            path.join(config.docsDirectory, 'README.adoc'),
            path.join(config.docsDirectory, 'apple1.adoc')
        ];

        let result = await getDocFileContent(expectedListOfFiles);

        expect(result).toHaveLength(2);
        // result[0] will be apple1 based on alphabetical order
        expect(result[1].fileName).toEqual('index');
        expect(result[1].fileTitle).toEqual('Index');
    });

    test('Should check that file titles are properly converted to title case', async () => {

        const expectedListOfFiles = [
            path.join(config.docsDirectory, 'README.adoc'),
            path.join(config.docsDirectory, 'apple1.adoc'),
            path.join(config.docsDirectory, 'sub', 'google-two.adoc'),
            path.join(config.docsDirectory, 'sub', 'sub-folder', 'microsoft_three.adoc'),
            path.join(config.docsDirectory, 'sub', 'sub-folder', 'sub-sub-folder', 'netflix.four.adoc')
        ];

        let result = await getDocFileContent(expectedListOfFiles);

        expect(result).toHaveLength(5);
        expect(result[0].fileName).toEqual(expectedFileContent[0].fileName);
        expect(result[1].fileName).toEqual(expectedFileContent[1].fileName);
        expect(result[2].fileName).toEqual(expectedFileContent[2].fileName);
        expect(result[3].fileName).toEqual(expectedFileContent[3].fileName);
        expect(result[4].fileName).toEqual(expectedFileContent[4].fileName);
    });

    test('Should get file details from default `docs` directory', async () => {

        const expectedListOfFiles = [
            path.join(config.docsDirectory, 'README.adoc'),
            path.join(config.docsDirectory, 'apple1.adoc'),
            path.join(config.docsDirectory, 'sub', 'google-two.adoc'),
            path.join(config.docsDirectory, 'sub', 'sub-folder', 'microsoft_three.adoc'),
            path.join(config.docsDirectory, 'sub', 'sub-folder', 'sub-sub-folder', 'netflix.four.adoc')
        ];

        let result = await getDocFileContent(expectedListOfFiles);

        expect(result).toHaveLength(5);
        expect(result).toEqual(expect.arrayContaining(expectedFileContent));
    });
});