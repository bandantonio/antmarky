import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import mockedFilesContents from '../snapshots/mockedFilesContents';
import * as saveHtmlModule from '../../src/saveHtml';

describe('saveHtml', () => {
    beforeEach(() => {
        vi.mock('../../../src/helpers/fileOperations', async () => {
            const actual = await vi.importActual('../../../src/helpers/fileOperations')
            return {
                ...actual!,
                write: vi.fn(() => Promise.resolve())
            };
        })
    });
    afterEach(() => {
        vi.doUnmock('../../../src/helpers/fileOperations');
    });
    test(`Should save HTML files to the 'dist' directory`, async () => {
        vi.spyOn(saveHtmlModule, 'saveHtmlPages');

        await saveHtmlModule.saveHtmlPages(mockedFilesContents);
        expect(saveHtmlModule.saveHtmlPages).toHaveBeenCalledWith(mockedFilesContents);
    });
});