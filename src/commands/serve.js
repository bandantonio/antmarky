let { findMdFiles, getFilesContent, convertMdToHtml } = require('../common/prepare-content');
let { embedRemoteMarkdown } = require('../common/embed-remote-markdown');

let serveContent = async (req, res, next) => {
  let locatedMdFiles = await findMdFiles();
  let allPages = locatedMdFiles;
  let mdFilesContent = await getFilesContent(locatedMdFiles);
  let mdFilesWithRemoteContent = await embedRemoteMarkdown(mdFilesContent);
  let htmlContent = convertMdToHtml(mdFilesWithRemoteContent);
  res.locals.files_data = htmlContent;
  res.locals.all_pages = allPages;
  next();
}

module.exports = {
  serveContent: serveContent
}