import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import defaultSettings from './default-settings';

const compileEjsTemplates = async () => {
    const templatesPath = path.resolve(process.cwd(), defaultSettings.viewsDirectory);

    // TODO: define the proper type for the object instead of any
    let compiledTemplates:any = {};

    const compilerOptions:ejs.Options = {
        async: true,
        views: [path.resolve(templatesPath)]
    }

    // there is no need to make expensive fs operation each time to get only two templates that do not change
    const listOfTemplates = ['page', 'error'];

    for (let template of listOfTemplates) {
        let templatePath = path.resolve(templatesPath, `${template}.ejs`);
        let templateContent = await fs.promises.readFile(templatePath, 'utf-8');
        
        compiledTemplates[template] = await ejs.compile(templateContent, compilerOptions);
    }

    return compiledTemplates;
};

export default compileEjsTemplates;