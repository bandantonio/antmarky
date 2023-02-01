import { TableOfContents } from "./interfaces/ItemDetails";

const buildTableOfContents = async (htmlDocument:string):Promise<TableOfContents[] | []> => {
    // To create a table of contents, you need to grab all the heading ids except for h1, hrefs, and heading titles.
    // Example of a heading link: <h2 id="section-1"><a class="anchor" href="#section-1"></a>Section 1</h2>
    // To grab all the data, regex matching groups are used: ?<id>, ?<link>, and ?<name>
    let matches = await Promise.all(htmlDocument.matchAll(/<h(?<id>[2-6]) id="(?<link>.*)"><a[\s\S]*?><\/a>(?<name>.*)<\/h[2-6]>/gi));
    
    if (!matches.length) return await Promise.resolve([]);
    return await Promise.all(matches.map(item => {
        return {
            id: item.groups!.id,
            link: item.groups!.link,
            title: item.groups!.name
        };
    }));
  };
  
  export default buildTableOfContents;