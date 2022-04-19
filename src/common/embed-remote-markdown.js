const axios = require('axios');
const { fileInclusionSchema } = require('../schemas/schemas');

const fileInclusion = async (url) => {
  try {
    await fileInclusionSchema.validateAsync(url);
  } catch (error) {
    throw Error(`The provided remote URL is not valid: ${error.message}`);
  }
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw Error(`Error retrieving information from the remote source: ${error}`);
  }
};

const embedRemoteMarkdown = async (mdFilesContent) => {
  const remoteContentExtractionRegex = /!!\+ (?<url>https:\/\/(?:github.com|bitbucket.org)\/[\S\s]*?.md)/g;
  return await Promise.all(mdFilesContent.map(async file => {
    let resultingContent = file.content;
    const isRemoteContent = file.content.match(remoteContentExtractionRegex);
    if (isRemoteContent) {
      const matches = file.content.matchAll(remoteContentExtractionRegex);
      for (const match of matches) {
        resultingContent = await fileInclusion(match.groups.url).then(content => {
          return resultingContent.replace(match[0], content);
        });
      }
    }
    return {
      name: file.name,
      title: file.title,
      content: resultingContent
    };
  }));
};

module.exports = {
  embedRemoteMarkdown
};
