const joi = require('joi');

// Components
const stringOrPath = joi.string();
const directoryNumberHierarchy = joi.number().min(0).max(4);
const stringWithCapitalLetter = stringOrPath.pattern(/^[A-Z][a-z]*/);
const lowercasedString = stringOrPath.case('lower');
const arrayOfStrings = joi.array().items(joi.string());
const htmlDocument = stringOrPath.pattern(/<!DOCTYPE [html|HTML][\s\S]*<html[\s\S]*<head>[\s\S]*<title>?[\s\S]*<\/title>?[\s\S]*<\/head>[\s\S]*<body[\s\S]*<\/body>[\s\S]*<\/html>/);

// Schemas
const findMdFilesSchema = stringOrPath.required();

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

// Validate raw URLs for Markdown files within GitHub and BitBucket
const fileInclusionSchema = stringOrPath.pattern(/https:\/\/(?:github.com|bitbucket.org)\/([\s\S]*?\/){2}raw\/([\s\S])*?\/([\s\S])*?.md/).required();

const convertMdToHtmlSchema = joi.array().min(1).items(
  joi.object({
    name: stringOrPath.required(),
    title: stringOrPath.required(),
    content: stringOrPath.required()
  }).required()
).required();

const saveHtmlContentSchemaFile = stringOrPath.pattern(/^([\w\d- ])*?\.html$/).required();

// Validate html to contain all the tags required for a document
const saveHtmlContentSchemaContent = htmlDocument.required();

const compileTemplateSchemaTemplatesPath = stringOrPath.required();
const compileTemplateSchemaTemplate = stringOrPath.required();

const removeOutputDirectorySchema = stringOrPath.valid('public').required();

const copyStaticAssetsSchema = stringOrPath.valid('assets').required();

const buildStaticFilesSchema = stringOrPath.required();

const buildTocSchema = htmlDocument.required();

module.exports = {
  findMdFilesSchema,
  filesContentSchema,
  fileInclusionSchema,
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
