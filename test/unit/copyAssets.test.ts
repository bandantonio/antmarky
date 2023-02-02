import { describe, expect, test } from '@jest/globals';
import * as mock from 'mock-fs';
import * as fs from 'fs';
import * as path from 'path';
import copyStaticAssets from "../../src/copy-assets";
import { directoryExists } from '../../src/helpers/directoryActions';

describe("module copyStaticAssets", () => {
    test("Copy static assets", async () => {
        // create a mock with files in the docs/static directory
        mock({
            'docs': {
                'README.adoc': '= Title\nHello world from the README.adoc file',
            },
            'docs/static': {
                'test.txt': 'Hello world from the test.txt file',
                'test2.txt': 'Hello world from the test2.txt file',
            },
            'src/views': mock.load(path.resolve('src/views')),
            'src/assets': mock.load(path.resolve('src/assets'))
        });

        await expect(directoryExists('public')).resolves.toBeFalsy();
        // await expect(directoryExists('public')).resolves.toBeTruthy();
        // let docs = await fs.promises.readdir(path.resolve('docs', 'static'));
        // console.log('docs/static', docs);

        // await copyStaticAssets();
        
        // let result = await fs.promises.readdir(path.resolve('public', 'css'));
        // console.log('pub/static', result);
        
        mock.restore();
    });

});