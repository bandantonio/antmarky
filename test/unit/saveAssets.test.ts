import fs from 'fs';
import mock from 'mock-fs';
import path from 'path';
import { afterEach, describe, expect, test, vi } from 'vitest';
import saveStaticAssets from '../../src/saveAssets';
import config from '../../src/config/defaultConfiguration';

// TODO: Fix tests
// mock-fs cannot mock the fs.promises.cp. Issue: https://github.com/tschaub/mock-fs/issues/358

describe('saveAssets', () => {
    test.todo('Copy static assets to the default output directory');
    test.todo('Throw an error when the system assets directory is invalid');
});

