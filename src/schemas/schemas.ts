import * as joi from 'joi';

// Components
const stringOrPath = joi.string();
const directoryNumberHierarchy = joi.number().min(0).max(4);
const stringWithCapitalLetter = stringOrPath.pattern(/^[A-Z][\w]*/);
const lowercasedString = stringOrPath.case('lower');
const fullHtmlDocument = stringOrPath.pattern(/<!DOCTYPE [html|HTML][\s\S]*<html[\s\S]*<head>[\s\S]*<title>[\s\S]*<\/title>[\s\S]*<\/head>[\s\S]*<body[\s\S]*<\/body>[\s\S]*<\/html>/);
const htmlDocumentBody = stringOrPath.pattern(/<\/?[^>]+>/); // just matches HTML tags, should be improved later
const arrayOfObjects = joi.array().min(1).items(
  joi.object({
    file: joi.string(),
    fileName: joi.string()
  })
);

// Schemas
const findDocFilesSchema = stringOrPath.allow('/', stringOrPath).required();

const filesContentSchema = joi.array().min(1).items(
  joi.object({
    dirLevel: directoryNumberHierarchy.required(),
    basePath: stringOrPath.required(),
    dirPath: stringOrPath.allow('').required(),
    dirName: stringWithCapitalLetter.required(),
    dirClass: lowercasedString.required(),
    files: arrayOfObjects.required()
  }).required()
).required();

const nameTitleContent = joi.array().min(1).items(
  joi.object({
    name: joi.object().required(),
    title: stringOrPath.required(),
    content: stringOrPath.required()
  }).required()
).required();

// Validate raw URLs for Markdown files within GitHub and BitBucket
const fileInclusionSchema = stringOrPath.pattern(/include::(https:\/\/raw.githubusercontent.com\/([\s\S]*?.adoc)\[\])/).required();

const convertDocToHtmlSchema = nameTitleContent.required();

const filenameSchema = stringOrPath.pattern(/^([\w-.])*?$/).required();
const saveHtmlContentSchemaFile = stringOrPath.pattern(/^([\w-.])*?\.html$/).required();

// Validate html to contain all the tags required for a document
const saveHtmlContentSchemaContent = fullHtmlDocument.required();

const compileTemplateSchemaTemplatesPath = stringOrPath.required();
const compileTemplateSchemaTemplate = stringOrPath.required();

const removeOutputDirectorySchema = stringOrPath.valid('public').required();

const copyStaticAssetsSchema = stringOrPath.valid('src/assets').required();

const buildStaticFilesSchema = stringOrPath.required();

const buildTocSchema = htmlDocumentBody.required();

const embedRemoteMarkdownSchema = nameTitleContent.required();

export {
  findDocFilesSchema,
  filenameSchema,
  filesContentSchema,
  fileInclusionSchema,
  embedRemoteMarkdownSchema,
  convertDocToHtmlSchema,
  saveHtmlContentSchemaFile,
  saveHtmlContentSchemaContent,
  compileTemplateSchemaTemplatesPath,
  compileTemplateSchemaTemplate,
  removeOutputDirectorySchema,
  copyStaticAssetsSchema,
  buildStaticFilesSchema,
  buildTocSchema
};
