import fastify, { FastifyReply, FastifyRequest, RequestGenericInterface } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { FileInfo, FileContent, findDocFiles, getFilesContent, convertDocToHtml } from './common/prepare-content';
import { adoc, asciidoctorDefaultConfig } from './common/parsers';
import errorPage from './data/defaults';
import fastifyStatic from '@fastify/static';
import { FileData } from './helpers/getDocFiles';
import { Asciidoctor } from 'asciidoctor/types';
const PORT = process.env.PORT || 8000;
const assetsDir = 'public';
asciidoctorDefaultConfig.attributes.imagesdir = assetsDir;

const server = fastify({ logger: true });

interface TableOfCOntents {
  id: string,
  link: string
  title: string
}

interface Converted {
  name: string
  title: string
  html: string | Asciidoctor.Document
  toc: TableOfCOntents[]
}

declare module 'fastify' {
  interface FastifyRequest {
    all_pages: FileInfo[],
    files_data: Converted[],
  }
}
interface requestGeneric extends RequestGenericInterface {
  Params: {
    pageName: string
  }
}

server.register(fastifyStatic, {
  root: path.join(__dirname, 'assets')
});

server.register(fastifyStatic, {
  root: path.join(process.cwd(), 'docs'),
  prefix: `/${assetsDir}`,
  decorateReply: false
});

server.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs')
  },
  root: path.join(__dirname, 'views')
});

server.addHook('preHandler', async (req, res) => {
  let locatedDocFiles = await findDocFiles();
  const docFilesContent = await getFilesContent(locatedDocFiles);
  let htmlContent = convertDocToHtml(docFilesContent);
  
  req.all_pages = locatedDocFiles;
  req.files_data = htmlContent;
});

interface RenderData {
  [key: string]: any;
}

server.get('/', (req, res) => {
  
  let renderData:RenderData = {};
  const specificPageData = req.files_data.find(page => page.name === 'README');
  renderData.name = (specificPageData) ? specificPageData.name : '/';
  renderData.title = (specificPageData) ? specificPageData.title : 'Home';
  renderData.content = (specificPageData) ? specificPageData.html : adoc.convert(fs.readFileSync(path.resolve('README.adoc'), 'utf-8'), asciidoctorDefaultConfig);
  // @ts-ignore
  renderData.pages = req.all_pages.filter(page => page.name !== 'README');
  // @ts-ignore
  res.view('index', renderData);
});

server.get<requestGeneric>('/:pageName.html', (req, res) => { 
  const pageTitle = req.params.pageName;
  const specificPageData = req.files_data.find(page => page.name === pageTitle);
  
  if (specificPageData) {
    const content = specificPageData.html;
    // @ts-ignore
    res.view('page', {
      name: specificPageData.name,
      title: pageTitle,
      content,
      toc: specificPageData.toc,
      // @ts-ignore
      pages: req.all_pages.filter(page => page.name !== 'README')
    });
  } else {
    // @ts-ignore
    res.status(404).view('404', {
      name: '404',
      text: errorPage.text,
      title: errorPage.title,
      // @ts-ignore
      pages: req.all_pages.filter(page => page.name !== 'README')
    });
  }
});

const start = async () => {
  try {
    // @ts-ignore
    await server.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
