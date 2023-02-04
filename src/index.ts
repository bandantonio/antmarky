import { processContent } from './process-content';
import createHtmlPages from './create-html-pages';
import copyStaticAssets from './copy-assets';
/**
 * Wrapper function to find Asciidoctor files and convert content to HTML
 * Returns an object containing two arrays:
 * - an array of objects with hierarchy of all pages
 * - an array of objects with all pages and corresponding HTML content
 */
const buildContent = async () => {

    await copyStaticAssets();
    let htmlContent = await processContent();    
    await createHtmlPages(htmlContent);
};

buildContent();

export default buildContent;