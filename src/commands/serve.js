const { findDocFiles, getFilesContent, convertDocToHtml } = require('../common/prepare-content');

const serveContent = async (req, res, next) => {
  const locatedDocFiles = await findDocFiles();
  const allPages = locatedDocFiles;
  const docFilesContent = await getFilesContent(locatedDocFiles);
  const htmlContent = convertDocToHtml(docFilesContent);
  res.locals.files_data = htmlContent;
  res.locals.all_pages = allPages;
  next();
};

module.exports = {
  serveContent: serveContent
};
