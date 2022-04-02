const buildToc = (htmlContent) => {
  const tocHeadings = [];
  const results = [...htmlContent.matchAll(/<h(?<id>[2-6]) id="(?<link>.*)">(?<name>.*)<\/h[2-6]>/g)];
  results.forEach(item => {
    tocHeadings.push({
      id: item.groups.id,
      link: item.groups.link,
      title: item.groups.name
    });
  });
  return tocHeadings;
};

module.exports = {
  buildToc
};
