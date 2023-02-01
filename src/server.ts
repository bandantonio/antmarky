import fastify, { RequestGenericInterface } from 'fastify';
import fastifyStatic from '@fastify/static';
import * as view from '@fastify/view';
import * as ejs from 'ejs';
import * as path from 'path';
import { processContent, getItemData } from './process-content';
import { ItemsWithHtml } from './interfaces/ItemDetails';
import defaultSettings from './default-settings';

const server = fastify({ logger: true });

declare module 'fastify' {
  interface FastifyRequest extends RequestGenericInterface {
    processed_content: ItemsWithHtml[]
  }
}

interface IParams {
  pageName: string;
};

// serve static files from the static folder inside the public directory
server.register(fastifyStatic, {
  root: path.resolve(defaultSettings.docsDirectory, defaultSettings.userStaticAssetsDirectory),
  prefix: '/static/',
  decorateReply: false
});

server.register(fastifyStatic, {
  root: path.join(__dirname, 'assets'),
  decorateReply: false
});

server.register(view, {
  engine: { ejs: ejs },
  root: path.join(__dirname, 'views')
});

server.addHook('preHandler', async (req, res) => {
  const processedContent = await processContent();
  req.processed_content = processedContent;
});

server.get('/', async (req, res) => {
  let pageName = 'index.html';
  
  let { title, html, sidebarPages, tableOfContents } = await getItemData('index.html', req.processed_content);
  // @ts-ignore
  await res.view('page', { pageName, title, html, sidebarPages, tableOfContents }, { async: true });
});

server.get<{ Params:IParams }>('/:pageName.html', async (req, res) => {
  let pageName = `${req.params.pageName}.html`;
  let itemData = await getItemData(pageName, req.processed_content);
  
  if (itemData.status === 404) {
    // @ts-ignore
    await res.status(404).view('error', { pageName, title: itemData.title, text: itemData.html }, { async: true });
  }
  
  let { title, html, sidebarPages, tableOfContents } = itemData;
  
  // @ts-ignore
  await res.view('page', { pageName, title, html, sidebarPages, tableOfContents }, { async: true });
});

const start = async () => {
  try {
    await server.listen({ port: 8000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
