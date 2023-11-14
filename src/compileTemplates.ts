import fs from 'fs';
import { glob } from 'glob';
import handlebars from 'handlebars';
import path from 'path';
import config from './config/defaultConfiguration';

const compileTemplates = async () => {
    const templatesDirectoryPath = path.resolve(config.templatesDirectory);

    let compiledTemplates: { [key: string]: any } = {};
    
    const listOfTemplates = await glob(path.join(templatesDirectoryPath, '/**/*.hbs'));
    
    for await (let template of listOfTemplates) {
        let templateName = template.match(/\/(\w+?).hbs/)![1];
        let templateContent = await fs.promises.readFile(template, 'utf-8');
        
        if (template.includes('partials')) {
            handlebars.registerPartial(templateName, templateContent);
        } else {
            compiledTemplates[templateName] = handlebars.compile(templateContent);
        }
    }

    return compiledTemplates;
};

export default compileTemplates;