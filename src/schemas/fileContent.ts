import { z } from 'zod';

const retrievedFileContentSchema = z.object({
    fileName: z.string().min(1).max(25),
    fileTitle: z.string().min(1).max(25),
    fileDir: z.string().max(255),
    // make sure that the passed content contains basic sections related to asciidoctor 
    fileHtmlContent: z.string().regex(/<div class="sect1">[\s\S]*<div class="sectionbody">[\s\S]*<\/div>[\s\S]*<\/div>/),
    tableOfContents: z.array(z.object({
        id: z.string().min(1).max(255),
        title: z.string().min(1).max(255),
        level: z.number().min(1).max(6)
    }))
});

type FileContent = z.infer<typeof retrievedFileContentSchema>;
export default FileContent;