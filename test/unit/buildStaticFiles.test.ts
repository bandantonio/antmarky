import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import * as mock from 'mock-fs';
import buildStaticFiles from '../../src/build-static-files';

describe('module buildStaticFiles', () => {  
  test('Ensure the output directory contains generated static files (root README)', async () => {
    mock({
      'docs': {
        'unit-test.adoc': '== Unit test 1\nUnit test 1 file content',
        'unit-test-2.adoc': '== Unit test 2\nUnit test 2 file content'
      },
      'docs/unit-sub-dir': {
        'unit-test-3.adoc': '== Unit test 3\nUnit test 3 file content'
      },
      'src/views': mock.load(path.resolve(process.cwd(), 'src/views')),
      'src/assets': mock.load(path.resolve(process.cwd(), 'src/assets')),
      'README.adoc': mock.load(path.resolve(process.cwd(), 'README.adoc')),
      
      'public': {}
    });
    
    // // Refactor expectations below (await-related)
    await buildStaticFiles();
    await expect(fs.promises.readdir('public')).resolves.toBeInstanceOf(Array);
    await expect(fs.promises.readdir('public')).resolves.toEqual(expect.arrayContaining(['css', 'index.html', 'unit-test.html', 'unit-test-2.html', 'unit-test-3.html', '404.html']));
    await expect(fs.promises.readdir('public')).resolves.toEqual(expect.not.arrayContaining(['unit-test-4.html']));
    expect(mock.bypass(() => fs.existsSync('public'))).toBeFalsy();

    mock.restore();
  });
  
  test('Ensure the output directory contains generated static files (README in the default docs directory)', async () => {
    mock({
      'docs': {
        'unit-test.adoc': '== Unit test 1\nUnit test 1 file content',
        'unit-test-2.adoc': '== Unit test 2\nUnit test 2 file content',
        'README.adoc': mock.load(path.resolve(process.cwd(), 'README.adoc'))
      },
      'docs/unit-sub-dir': {
        'unit-test-3.adoc': '== Unit test 3\nUnit test 3 file content'
      },
      'src/views': mock.load(path.resolve(process.cwd(), 'src/views')),
      'src/assets': mock.load(path.resolve(process.cwd(), 'src/assets')),
      
      'public': {}
    });
    
    // Refactor expectations below (await-related)
    await buildStaticFiles();
    await expect(fs.promises.readdir('public')).resolves.toBeInstanceOf(Array);
    await expect(fs.promises.readdir('public')).resolves.toEqual(expect.arrayContaining(['css', 'index.html', 'unit-test.html', 'unit-test-2.html', 'unit-test-3.html', '404.html']));
    await expect(fs.promises.readdir('public')).resolves.toEqual(expect.not.arrayContaining(['unit-test-4.html']));
    expect(mock.bypass(() => fs.existsSync('public'))).toBeFalsy();

    mock.restore();
  });
  
  test('Error when deleting output folder', async () => {
    await expect(buildStaticFiles('docs', 'ublic')).rejects.toThrow();
  });

  test('Ensure assets in the default docs directory are copied to the output directory', async () => {
    mock({
      'docs': {
        'unit-test.adoc': '== Unit test 1\nUnit test 1 file content',
      },
      'docs/assets': {
        'dummy.json': '{ "userId": 1, "title": "delectus aut autem", "completed": false }',
        'js.png': 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACpklEQVRoge2ZS0hUURjHf8d8Zy8kn2lmZWkYJWUIIkGLwKQWgQ/EjaQJEj0QKi3bFC6LgogIF2Zgj8VUPijUiCAYok2mkAYqNKJiKFY2Ezmnxa0OozM1k3rvovODy/3O+c7j+3Mu53VBo9ForET4csg+pJmB/A2R4T3WILMDWWy0AKvRAqxGC7AaLcBqtACr0QKsRguwmiUTIDLE7+f+E0/f2wEoqRHE5wlCMgWJewVlpwW97wPvx/QR6LbD7kJBSzuMTsD3WRgZh+bHkF0o6LYH1p6pAtxuOHJe4HQZ6bBQSE813gAzTqi9LJABnAVNFdAzAIMffnYcBK/uSfpaJf0dko1JcLwMOhslwudBdz7BSxOqd6amlR0aAls2GHZyPPQ8lESEB96mqSOQmqRspwuKTgmGR4z0vwQPJgtIioP9uSpt64KtBwQV9YKB4X9r0/RZqPGiZGe6SjtdcOsBpBcYQr58Daw90wUkxMCLZkltJURFqvzZWUNITolgctp3/blYshIvj4BLJyRDnZKGk5LYaOXr6YcL1/yfhpZEgNv9Z/+veT56NZypgHftkj3bld/W5X9fCxYwPAKHqgVtz1XeoMOzTESYsm8/guwiwecZlbdqBRTnq9Vr7KP//S9oHbjbAeV1ghknPH0pqCqCtBTJnVbPTyAl0XiX1BhbCICD1YKmBsm6OJj6BLYuVScx1iQBc2eTK00w975483rYtsmwc3ZIWtoN/zM7JO8TJMTAxCS4vqk6xfn+x7CgTygtBdpuSFZGefeHhsD1erU1OFYK56qUX0pwjHkGn7cL6o76vxlalOv10QlouCmwdYFjHNaugdwsOFspycqYX97+Bq42C173wpADIsMhMw1KCyTlhyF4mZdAfVyv6/8DVqMFaDQazf/ND8ttt3KFrySDAAAAAElFTkSuQmCC'
      },
      'src/views': mock.load(path.resolve(process.cwd(), 'src/views')),
      'src/assets': mock.load(path.resolve(process.cwd(), 'src/assets')),
      'README.adoc': mock.load(path.resolve(process.cwd(), 'README.adoc')),
      
      'public': {}
    });
    
    // Refactor expectations below (await-related)
    await buildStaticFiles();
    await expect(fs.promises.readdir('public')).resolves.toBeInstanceOf(Array);
    await expect(fs.promises.readdir('public')).resolves.toStrictEqual(expect.arrayContaining(['404.html', 'assets', 'css', 'index.html', 'unit-test.html']));
    await expect(fs.promises.readdir('public/assets')).resolves.toStrictEqual(expect.arrayContaining(['dummy.json', 'js.png']));
    expect(mock.bypass(() => fs.existsSync('public'))).toBeFalsy();

    mock.restore();
  });
  
  test.todo('Throw error when passed an incorrect filename');
});