const { findDocFiles, getFilesContent, convertDocToHtml } = require('../common/prepare-content');
const { embedRemoteMarkdown } = require('../common/embed-remote-markdown');

const serveContent = async (req, res, next) => {
  const locatedDocFiles = await findDocFiles();
  const allPages = locatedDocFiles;
  const docFilesContent = await getFilesContent(locatedDocFiles);
  const docFilesWithRemoteContent = await embedRemoteMarkdown(docFilesContent);
  const htmlContent = convertDocToHtml(docFilesWithRemoteContent);
  res.locals.files_data = htmlContent;
  res.locals.all_pages = allPages;
  next();
};

module.exports = {
  serveContent: serveContent
};
