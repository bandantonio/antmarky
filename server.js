const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;
const { serveContent } = require('./src/commands/serve');
let { md } = require('./src/common/md-parser');
const { buildToc } = require('./src/toc');
let { errorPage } = require('./src/data/defaults');
app.use(serveContent);

app.set('view engine', 'ejs');
app.use(express.static('src/assets'));


app.get('/', (req, res) => {
  let renderData = {};
  let specificPageData = res.locals.files_data.find(page => page.name == 'README');
  renderData.name = (specificPageData) ? specificPageData.name : '/';
  renderData.title = (specificPageData) ? specificPageData.title : 'Home';
  renderData.content = (specificPageData) ? specificPageData.html : md.makeHtml(fs.readFileSync(path.resolve('README.md'), 'utf-8'));
  renderData.pages = res.locals.all_pages.filter(page => page.name !== 'README');
  res.render('index', renderData);
});

app.get('/:pageName.html', (req, res) => {
  let pageTitle = req.params.pageName;
  let specificPageData = res.locals.files_data.find(page => page.name == pageTitle);
  if (specificPageData) {
    let content = specificPageData.html;
    res.render('page', {
      name: specificPageData.name,
      title: pageTitle,
      content,
      toc: buildToc(content),
      pages: res.locals.all_pages.filter(page => page.name !== 'README')
    })
  } else {
    res.status(404).render('404', {
      text: errorPage.text,
      title: errorPage.title
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
