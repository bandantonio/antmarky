import { describe, expect, test } from '@jest/globals';
import * as mock from 'mock-fs';
import * as fs from 'fs';
import * as path from 'path';
import copyStaticAssets from '../../src/copy-assets';
import { directoryExists } from '../../src/helpers/directoryActions';

// TODO: Fix tests
// mock-fs cannot mock the fs.promises.cp. Issue: https://github.com/tschaub/mock-fs/issues/358
describe('module copyStaticAssets', () => {
    test.todo('Copy static assets');
    test('Copy static assets when the output folder already exists', async () => {
        mock({
            'docs': {
                'README.adoc': '== Index\nIndex file content',
            },
            'src/views': mock.load(path.resolve('src/views')),
            'src/assets': mock.load(path.resolve('src/assets')),
            'public': {}
        });

        await expect(directoryExists(path.resolve('public'))).resolves.toBeTruthy();
        await copyStaticAssets();
        await expect(fs.promises.readdir('public')).resolves.toEqual(expect.arrayContaining(['css']));
        // await expect(fs.promises.readdir('public')).resolves.toEqual(expect.arrayContaining(['css', 'index.html', '404.html']));

        mock.restore();
    });

    test('Check that the output directory is created when it does not exist', async () => {
        mock({
            'docs': {
                'README.adoc': '== Index\nIndex file content',
            },
            'src/views': mock.load(path.resolve('src/views')),
            'src/assets': mock.load(path.resolve('src/assets')),
        });

        await expect(directoryExists(path.resolve('public'))).resolves.toBeFalsy();
        await copyStaticAssets();
        await expect(directoryExists(path.resolve('public'))).resolves.toBeTruthy();
        
        mock.restore();
    });
    test.skip('Throw an error when the system assets directory is invalid', async () => {        
        mock({
            'docs': {
                'README.adoc': '== Index\nIndex file content',
            },
            'src/views': mock.load(path.resolve('src/views')),
            'src/assetss': mock.load(path.resolve('src/assets')),
        });

        await expect(copyStaticAssets()).resolves.toThrow('Cannot copy the contents of the directory');

        mock.restore();
    });
});