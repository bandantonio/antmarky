import findDocFiles from '../findFiles';
import getDocFileContent from '../getContent';
import saveHtmlPages from '../saveHtml';
import saveStaticAssets from '../saveAssets';
import { emptyDirectory } from '../helpers/directoryActions';
import config from '../config/defaultConfiguration';

const buildDocs = async () => {
    console.time('Build time');
    let files = await findDocFiles();
    let content = await getDocFileContent(files);

    await emptyDirectory(config.outputDirectory);
    await saveHtmlPages(content);
    await saveStaticAssets();
    console.timeEnd('Build time');

}

export default buildDocs;