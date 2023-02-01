interface Item {
    name: string,
    href: string,
}
interface ItemsList extends Item {
    type: 'file' | 'directory'
    children?: ItemsList[]
}

interface ItemsWithContent extends Item {
    content: string
}

interface ItemsWithHtml extends Item {
    title: string,
    html: string
}

interface TableOfContents {
    id: string,
    link: string,
    title: string
}

interface ItemToRender {
    status: number,
    title: string,
    html: string,
    sidebarPages?: ItemsWithHtml[],
    tableOfContents?: TableOfContents[]
}

export {
    ItemsList,
    ItemsWithContent,
    ItemsWithHtml,
    TableOfContents,
    ItemToRender
}