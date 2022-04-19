const axios = require('axios');

let fileInclusion = async (url) => {
  try {
    let response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

let embedRemoteMarkdown = async (mdFilesContent) => {
  let remoteContentExtractionRegex = /!!\+ (?<url>https:\/\/(?:github.com|bitbucket.org)\/[\S\s]*?.md)/g;
  return await Promise.all(mdFilesContent.map(async file => {
    let resultingContent = file.content;
    let isRemoteContent = file.content.match(remoteContentExtractionRegex);
    if (isRemoteContent) {
      let matches = file.content.matchAll(remoteContentExtractionRegex);
      for (let match of matches) {
        resultingContent = await fileInclusion(match.groups.url).then(content => {
          return resultingContent.replace(match[0], content);
        });
      }
    }
    return {
      name: file.name,
      title: file.title,
      content: resultingContent
    }
  }));
}

module.exports = {
  embedRemoteMarkdown
}