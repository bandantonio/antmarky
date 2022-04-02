const { findMdFiles, getFilesContent, convertMdToHtml } = require('../common/prepare-content');
const { embedRemoteMarkdown } = require('../common/embed-remote-markdown');

const serveContent = async (req, res, next) => {
  const locatedMdFiles = await findMdFiles();
  const allPages = locatedMdFiles;
  const mdFilesContent = await getFilesContent(locatedMdFiles);
  const mdFilesWithRemoteContent = await embedRemoteMarkdown(mdFilesContent);
  const htmlContent = convertMdToHtml(mdFilesWithRemoteContent);
  res.locals.files_data = htmlContent;
  res.locals.all_pages = allPages;
  next();
};

module.exports = {
  serveContent: serveContent
};
