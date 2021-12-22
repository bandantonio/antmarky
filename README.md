# Antmarky

Antmarky is a static-site generator for Markdown based on Node.js/EJS.

## Features

* Zero configuration
* Fully static (doesn't require web server to work)
* No language frameworks included
* Markdown flavor: `GitHub`. Supported syntax:
    * Automatic heading ids
    * Blockqoutes
    * Emojis :tada:
    * Images with inline dimensions attributes
    * Reference links
    * Strikethrough
    * Subscript
    * Superscript
    * Tables
* Admonitions
* Automatic code syntax highlighting
* Font Awesome
* Automatic table of contents for pages
* Task lists (todo lists)

## Usage

### Build content

```
npm i
npm run build
```

Website static files will be generated in the `public` folder.

### Run local server

```
npm i
npm run serve
```

Local server will be launched at `http://localhost:8000`.