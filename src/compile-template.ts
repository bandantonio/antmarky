import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { compileTemplateSchemaTemplatesPath, compileTemplateSchemaTemplate } from './schemas/schemas'
import defaultSettings from './default-settings';

/**
 * Compile EJS partials into a working template
 */
const compileTemplate = (template:string) => {
    const templatesPath = path.join(`${process.cwd()}/${defaultSettings.viewsDirectory}`);
    const validateTemplate = compileTemplateSchemaTemplate.validate(template);
    
    if (!validateTemplate.error) {
        const compiledTemplate = ejs.compile(fs.readFileSync(templatesPath + '/' + template, 'utf-8'), {
            views: [path.resolve(templatesPath)]
        });
        return compiledTemplate;
    }
};

export default compileTemplate;