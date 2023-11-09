import Asciidoctor from 'asciidoctor';
const asciidoctor = Asciidoctor();
import config from './config/defaultConfiguration';

const asciidoctorConfig = {
  attributes: {
    icons: 'font',
    idprefix: '',
    idseparator: '-',
    sectanchors: '~',
    showtitle: '',
    toc: ''
  },
  safe: 'unsafe',
  to_dir: config.outputDirectory,
};

export {
  asciidoctor,
  asciidoctorConfig
}
