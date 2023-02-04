import Asciidoctor from 'asciidoctor';
const asciidoctor = Asciidoctor();

const asciidoctorDefaultConfig = {
  attributes: {
    icons: 'font',
    idprefix: '',
    idseparator: '-',
    sectanchors: '',
    imagesdir: 'static',
    showtitle: ''
  },
  safe: 'unsafe',
};

export {
  asciidoctor as adoc,
  asciidoctorDefaultConfig
}
