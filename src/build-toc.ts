import { buildTocSchema } from './schemas/schemas';

const buildToc = (htmlContent:string) => {
  return [...htmlContent.matchAll(/<h(?<id>[2-6]) id="(?<link>.*)"><a[\s\S]*?><\/a>(?<name>.*)<\/h[2-6]>/gi)].map(item => {
    return {
      id: item.groups!.id,
      link: item.groups!.link,
      title: item.groups!.name
    };
  });
};

export default buildToc;
