import FileContent from './interfaces/fileContent';
import { adoc, asciidoctorDefaultConfig } from './asciidoc-parser';
import buildToc from './build-toc';

const convertDocToHtml = (docTextArray:FileContent[]) => {
    return docTextArray.map(docText => {
        const fileName = docText.name.file;
        const fileTitle = docText.title;
        const html = adoc.convert(docText.content, asciidoctorDefaultConfig);
        
        const tableOfCOntents = buildToc(html as string);
        
        return {
            name: fileName.substring(0, fileName.lastIndexOf('.')),
            title: fileTitle.substring(0, fileTitle.lastIndexOf('.')),
            html,
            toc: tableOfCOntents
        };
    });
};

export default convertDocToHtml;