import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import config from './config/defaultConfiguration';

const compileTemplates = async () => {
    const templatesDirectoryPath = path.resolve(config.templatesDirectory);

    const compilerOptions: ejs.Options = {
        async: true,
        views: [path.resolve(templatesDirectoryPath)]
    }

    // TODO: define the proper type for the object instead of any
    let compiledTemplates: any = {};

    const listOfTemplates = ['page', '404'];

    for await (let template of listOfTemplates) {
        let templatePath = path.resolve(templatesDirectoryPath, `${template}.ejs`);
        let templateContent = await fs.promises.readFile(templatePath, 'utf-8');

        compiledTemplates[template] = ejs.compile(templateContent, compilerOptions);
    }

    return compiledTemplates;
};

export default compileTemplates;