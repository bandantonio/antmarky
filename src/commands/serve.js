let { findMdFiles, getFilesContent, convertMdToHtml } = require('../common/prepare-content')

let serveContent = async (req, res, next) => {
  let locatedMdFiles = await findMdFiles();
  let allPages = locatedMdFiles;
  let filesMdContent = await getFilesContent(locatedMdFiles);
  let htmlContent = convertMdToHtml(filesMdContent);
  res.locals.files_data = htmlContent;
  res.locals.all_pages = allPages;
  next();
}

module.exports = {
  serveContent: serveContent
}