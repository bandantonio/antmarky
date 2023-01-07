import Asciidoctor from 'asciidoctor';
const asciidoctor = Asciidoctor();

const asciidoctorDefaultConfig = {
  attributes: {
    icons: 'font',
    idprefix: '',
    idseparator: '-',
    sectanchors: '',
    imagesdir: ''
  },
  safe: 'safe'
};

export {
  asciidoctor as adoc,
  asciidoctorDefaultConfig
}
