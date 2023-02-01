import * as path from 'path';
import { adoc, asciidoctorDefaultConfig } from './asciidoc-parser';
import defaultSettings from './default-settings';
import { ItemsWithContent, ItemsWithHtml } from './interfaces/ItemDetails';

const convertDocToHtml = (itemsWithContent:ItemsWithContent[]):ItemsWithHtml[] => {
    
    let itemsWithHtml:ItemsWithHtml[] = [];
    
    for (let item of itemsWithContent) {
        let fileName = '';

        if (item.name !== 'README.adoc') {
            const normalizedFileName = item.name.replace(/ /g, '-').replace('adoc', 'html');
            fileName = normalizedFileName;
        } else {
            fileName = 'index.html';
        }

        const itemTitle = adoc.load(item.content!).getDocumentTitle();
        const relativePathToItem = path.relative(defaultSettings.docsDirectory, item.href!.replace('.adoc', '.html'));
        let html = adoc.convert(item.content!, asciidoctorDefaultConfig);
        
        itemsWithHtml.push({
            name: fileName,
            title: itemTitle as string,
            href: relativePathToItem,
            html: html as string
        });
    }

    return itemsWithHtml;
};

export default convertDocToHtml;