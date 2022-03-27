const { string } = require('joi');
const joi = require('joi');

// Components
let stringOrPath = joi.string();
let directoryNumberHierarchy = joi.number().min(0).max(4);
let stringWithCapitalLetter = stringOrPath.pattern(/^[A-Z][a-z]*/);
let lowercasedString = stringOrPath.case('lower');
let arrayOfStrings = joi.array().items(joi.string());

// Schemas
const findMdFilesSchema = stringOrPath.required();

let filesContentSchema = joi.array().min(1).items(
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
let fileInclusionSchema = stringOrPath.pattern(/https:\/\/(?:github.com|bitbucket.org)\/([\s\S]*?\/){2}raw\/([\s\S])*?\/([\s\S])*?.md/).required();

let convertMdToHtmlSchema = joi.array().min(1).items(
  joi.object({
    name: stringOrPath.required(),
    title: stringOrPath.required(),
    content: stringOrPath.required()
  }).required()
).required();

let saveHtmlContentSchemaFile = stringOrPath.pattern(/^([\w\d- ])*?\.html$/).required();

// Validate html to contain all the tags required for a document
let saveHtmlContentSchemaContent = stringOrPath.pattern(/<!DOCTYPE html[\s\S]*<html[\s\S]*<head>[\s\S]*<title>[\s\S]*<\/title>[\s\S]*<\/head>[\s\S]*<body[\s\S]*<\/body>[\s\S]*<\/html>/).required();

let compileTemplateSchemaTemplatesPath = stringOrPath.required();
let compileTemplateSchemaTemplate = stringOrPath.required();

let removeOutputDirectorySchema = stringOrPath.valid('public').required();

let copyStaticAssetsSchema = stringOrPath.valid('assets').required();

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
  copyStaticAssetsSchema
}