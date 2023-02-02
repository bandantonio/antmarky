import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import * as mock from 'mock-fs';
import {
    createDirectory,
    cleanDirectoryContents,
    directoryExists,
    copyDirectoryContentsToDestination
} from '../../src/helpers/directoryActions';

describe('module directoryActions', () => {
    describe('function createDirectory', () => {
        test('Successfully create a directory', async () => {
            // create a mock with files in the docs/static directory
            mock({
                'docs': {
                    'README.adoc': '= Title\nHello world from the README.adoc file',
                }
            });
            
            await expect(directoryExists('docs')).resolves.toBeTruthy();
            await expect(directoryExists('public')).resolves.toBeFalsy();
            await createDirectory('public');
            await expect(directoryExists('public')).resolves.toBeTruthy();
            
            mock.restore();
        });
        
        test('Throw an error when a directory cannot be created', async () => {
            // create a mock with files in the docs/static directory
            mock({
                'docs': mock.directory({
                    // mode read-only
                    mode: 0o644,
                })
            });
            
            await expect(directoryExists('docs')).resolves.toBeTruthy();
            await expect(directoryExists('docs/public')).resolves.toBeFalsy();
            const pathToFakeDirectory = path.resolve('docs', 'public');
            await expect(createDirectory(pathToFakeDirectory)).rejects.toThrow(`Cannot create the directory: '${pathToFakeDirectory}'`);
            
            mock.restore();
        });
    });
    describe('function cleanDirectoryContents', () => {
        test('Successfully clean a directory', async () => {
            mock({
                'docs': {
                    'README.adoc': '= Title\nHello world from the README.adoc file',
                }
            });
            
            await expect(fs.promises.readdir(path.resolve('docs'))).resolves.toContain('README.adoc');
            await cleanDirectoryContents('docs');
            await expect(fs.promises.readdir(path.resolve('docs'))).resolves.toHaveLength(0);
            
            mock.restore();
        });
        test('Throw an error when a directory cannot be emptied', async () => {
            mock({
                'docs': mock.directory({
                    mode: 0o644,
                    items: {
                        'README.adoc': mock.file({
                            mode: 0o444,
                            content: '= Title\nHello world from the README.adoc file',
                            
                        })
                    }
                })
            });
            
            await expect(fs.promises.readdir(path.resolve('docs'))).resolves.toContain('README.adoc');
            await expect(cleanDirectoryContents('docs')).rejects.toBeFalsy();
            
            mock.restore();
        });
    });
    describe.skip('function copyDirectoryContentsToDestination', () => {
        test('Successfully copy a directory into a new destination', async () => {
            mock({
                'docs': {
                    'README.adoc': '= Title\nHello world from the README.adoc file',
                }
            });

            let source = 'docs';
            let destination = 'public';

            await copyDirectoryContentsToDestination(path.resolve(source), path.resolve(destination));
            let res = await fs.promises.readdir(path.resolve(destination));
            console.log('res after copy', res);
            
            await expect(fs.promises.readdir(path.resolve('public'))).resolves.toContain('README.adoc');

            mock.restore();
        });
    });

    // describe('function directoryExists', () => {
    //     test('Successfully check if a directory exists', async () => {
    //         mock({
    //             'docs': {}
    //         });
            
    //         await expect(directoryExists('docs')).resolves.toBeTruthy();
    //         await expect(directoryExists('public')).resolves.toBeFalsy();
    //         await expect(directoryExists('bad#path#to#a#directory')).resolves.toBeFalsy();
            
    //         mock.restore();
    //     });
    // });


});