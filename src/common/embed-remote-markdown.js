const axios = require('axios');
const { fileInclusionSchema, embedRemoteMarkdownSchema } = require('../schemas/schemas');

const fileInclusion = async (url) => {
  await fileInclusionSchema.validateAsync(url).catch(error => {
    throw error;
  });

  return axios.get(url).then(response => {
    return response.data;
  }).catch(error => {
    throw error;
  });
};

const embedRemoteMarkdown = async (docFilesContent) => {
  try {
    await embedRemoteMarkdownSchema.validateAsync(docFilesContent);
  } catch (error) {
    throw new Error('Cannot search for remote URLs. The provided content is invalid.');
  }

  const remoteContentExtractionRegex = /!!\+ (?<url>https:\/\/(?:github.com|bitbucket.org)\/[\S\s]*?.md)/g;
  return await Promise.all(docFilesContent.map(async file => {
    let resultingContent = file.content;
    const isRemoteContent = file.content.match(remoteContentExtractionRegex);
    if (isRemoteContent) {
      const matches = file.content.matchAll(remoteContentExtractionRegex);
      for (const match of matches) {
        resultingContent = await fileInclusion(match.groups.url).then(content => {
          return resultingContent.replace(match[0], content);
        }).catch(() => {
          throw new Error('Cannot retrieve the remote content. Something wrong with the URL.');
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
