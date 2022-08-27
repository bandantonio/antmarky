const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const { findDocFiles, getFilesContent, convertDocToHtml } = require('./src/common/prepare-content');
const { adoc, asciidoctorDefaultConfig } = require('./src/common/parsers');
const { errorPage } = require('./src/data/defaults');
const fastifyStatic = require('@fastify/static');
const PORT = 8000;
const assetsDir = 'public';
asciidoctorDefaultConfig.attributes.imagesdir = assetsDir;

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'src/assets')
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'docs'),
  prefix: `/${assetsDir}`,
  decorateReply: false
});

fastify.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs')
  },
  root: path.join(__dirname, 'views')
});

fastify.addHook('preHandler', async (req, res) => {
  const locatedDocFiles = await findDocFiles();
  const allPages = locatedDocFiles;
  const docFilesContent = await getFilesContent(locatedDocFiles);
  const htmlContent = convertDocToHtml(docFilesContent);

  req.files_data = htmlContent;
  req.all_pages = allPages;
});

fastify.get('/', (req, res) => {
  const renderData = {};
  const specificPageData = req.files_data.find(page => page.name === 'README');
  renderData.name = (specificPageData) ? specificPageData.name : '/';
  renderData.title = (specificPageData) ? specificPageData.title : 'Home';
  renderData.content = (specificPageData) ? specificPageData.html : adoc.convert(fs.readFileSync(path.resolve('README.adoc'), 'utf-8'), asciidoctorDefaultConfig);
  renderData.pages = req.all_pages.filter(page => page.name !== 'README');
  res.view('index', renderData);
});

fastify.get('/:pageName.html', (req, res) => {
  const pageTitle = req.params.pageName;
  const specificPageData = req.files_data.find(page => page.name === pageTitle);
  if (specificPageData) {
    const content = specificPageData.html;
    res.view('page', {
      name: specificPageData.name,
      title: pageTitle,
      content,
      toc: specificPageData.toc,
      pages: req.all_pages.filter(page => page.name !== 'README')
    });
  } else {
    res.status(404).view('404', {
      name: '404',
      text: errorPage.text,
      title: errorPage.title,
      pages: req.all_pages.filter(page => page.name !== 'README')
    });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
