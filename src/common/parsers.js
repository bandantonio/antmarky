const Asciidoctor = require('asciidoctor');
const asciidoctor = Asciidoctor();

const asciidoctorDefaultConfig = {
  attributes: {
    icons: 'font',
    idprefix: '',
    idseparator: '-',
    sectanchors: ''
  },
  safe: 'safe'
};

module.exports = {
  adoc: asciidoctor,
  asciidoctorDefaultConfig
};
