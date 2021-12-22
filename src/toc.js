let buildToc = (htmlContent) => {
  let tocHeadings = [];
  let results = [...htmlContent.matchAll(/<h[1-6] id="(?<link>.*)">(?<name>.*)<\/h[1-6]>/g)];
  results.map(item => {
    tocHeadings.push({
      link: item.groups.link,
      title: item.groups.name
    });
  });
  return tocHeadings;
}

module.exports = {
  buildToc
}