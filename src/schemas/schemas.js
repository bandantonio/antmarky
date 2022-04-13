const joi = require('joi');

// Components
const stringOrPath = joi.string();
const directoryNumberHierarchy = joi.number().min(0).max(4);
const stringWithCapitalLetter = stringOrPath.pattern(/\w+/);
const lowercasedString = stringOrPath.case('lower');
const arrayOfStrings = joi.array().items(joi.string());
const fullHtmlDocument = stringOrPath.pattern(/<!DOCTYPE [html|HTML][\s\S]*<html[\s\S]*<head>[\s\S]*<title>[\s\S]*<\/title>[\s\S]*<\/head>[\s\S]*<body[\s\S]*<\/body>[\s\S]*<\/html>/);
const htmlDocumentBody = stringOrPath.pattern(/<\/?[^>]+>/); // just matches HTML tags, should be improved later

// Schemas
const findMdFilesSchema = stringOrPath.allow('/', stringOrPath).required();

const filesContentSchema = joi.array().min(1).items(
  joi.object({
    dirLevel: directoryNumberHierarchy.required(),
    basePath: stringOrPath.required(),
    dirPath: stringOrPath.allow('').required(),
    dirName: stringWithCapitalLetter.required(),
    dirClass: lowercasedString.required(),
    files: arrayOfStrings.required()
  }).required()
).required();

const nameTitleContent = joi.array().min(1).items(
  joi.object({
    name: stringOrPath.required(),
    title: stringOrPath.required(),
    content: stringOrPath.required()
  }).required()
).required();

// Validate raw URLs for Markdown files within GitHub and BitBucket
const fileInclusionSchema = stringOrPath.pattern(/https:\/\/(?:github.com|bitbucket.org)\/([\s\S]*?\/){2}raw\/([\s\S])*?\/([\s\S])*?.md/).required();

const convertMdToHtmlSchema = nameTitleContent.required();

const saveHtmlContentSchemaFile = stringOrPath.pattern(/^([\w\d- ])*?\.html$/).required();

// Validate html to contain all the tags required for a document
const saveHtmlContentSchemaContent = fullHtmlDocument.required();

const compileTemplateSchemaTemplatesPath = stringOrPath.required();
const compileTemplateSchemaTemplate = stringOrPath.required();

const removeOutputDirectorySchema = stringOrPath.valid('public').required();

const copyStaticAssetsSchema = stringOrPath.valid('assets').required();

const buildStaticFilesSchema = stringOrPath.required();

const buildTocSchema = htmlDocumentBody.required();

const embedRemoteMarkdownSchema = nameTitleContent.required();

module.exports = {
  findMdFilesSchema,
  filesContentSchema,
  fileInclusionSchema,
  embedRemoteMarkdownSchema,
  convertMdToHtmlSchema,
  saveHtmlContentSchemaFile,
  saveHtmlContentSchemaContent,
  compileTemplateSchemaTemplatesPath,
  compileTemplateSchemaTemplate,
  removeOutputDirectorySchema,
  copyStaticAssetsSchema,
  buildStaticFilesSchema,
  buildTocSchema
};
