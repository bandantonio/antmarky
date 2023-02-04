import { getItemData } from '../../src/process-content';

describe('module processContent', () => {
    it('should successfully return an object to render with a 200 status code', async () => {
        const pageName = 'existing-page.html';
        const htmlContent = [
        {
            name: 'existing-page.html',
            href: 'existing-page.html',
            title: 'Test title',
            html: 'Test html',
        }];
        const result = await getItemData(pageName, htmlContent);

        expect(result.status).toEqual(200);
        expect(result.title).toEqual('Test title');
    });
    it('should return an object to render with a 404 status code', async () => {
        const pageName = 'non-existing-page.html';
        const htmlContent = [
        {
            name: 'existing-page.html',
            href: 'existing-page.html',
            title: 'Test title',
            html: 'Test html',
        }];
        const result = await getItemData(pageName, htmlContent);

        expect(result.status).toEqual(404);
        expect(result.title).toEqual('Not Found');
    });
});