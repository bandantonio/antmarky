const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;
const { serveContent } = require('./src/commands/serve');
const { adoc, asciidoctorDefaultConfig } = require('./src/common/parsers');
const { errorPage } = require('./src/data/defaults');
app.use(serveContent);

app.set('view engine', 'ejs');
app.use(express.static('src/assets'));
app.use(express.static('docs'));

app.get('/', (req, res) => {
  const renderData = {};
  const specificPageData = res.locals.files_data.find(page => page.name === 'README');
  renderData.name = (specificPageData) ? specificPageData.name : '/';
  renderData.title = (specificPageData) ? specificPageData.title : 'Home';
  renderData.content = (specificPageData) ? specificPageData.html : adoc.convert(fs.readFileSync(path.resolve('README.adoc'), 'utf-8'), asciidoctorDefaultConfig);
  renderData.pages = res.locals.all_pages.filter(page => page.name !== 'README');
  res.render('index', renderData);
});

app.get('/:pageName.html', (req, res) => {
  const pageTitle = req.params.pageName;
  const specificPageData = res.locals.files_data.find(page => page.name === pageTitle);
  if (specificPageData) {
    const content = specificPageData.html;
    res.render('page', {
      name: specificPageData.name,
      title: pageTitle,
      content,
      toc: specificPageData.toc,
      pages: res.locals.all_pages.filter(page => page.name !== 'README')
    });
  } else {
    res.status(404).render('404', {
      name: '404',
      text: errorPage.text,
      title: errorPage.title,
      pages: res.locals.all_pages.filter(page => page.name !== 'README')
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
