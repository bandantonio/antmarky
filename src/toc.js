const { buildTocSchema } = require('./schemas/schemas');

const buildToc = (htmlContent) => {
  const validation = buildTocSchema.validate(htmlContent);

  if (validation.error) {
    throw new Error('Can\'t build table of contents, the provided content is invalid');
  }

  return [...htmlContent.matchAll(/<h(?<id>[2-6]) id="(?<link>.*)">(?<name>.*)<\/h[2-6]>/g)].map(item => {
    return {
      id: item.groups.id,
      link: item.groups.link,
      title: item.groups.name
    };
  });
};

module.exports = {
  buildToc
};
