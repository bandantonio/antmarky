# Antmarky

Antmarky is a static-site generator for Markdown based on Node.js/EJS.

![Docker Pulls](https://img.shields.io/docker/pulls/bandantonio/antmarky)

The main idea behind creating Antmarky was to have a generator with *zero configuration* that can serve your Markdown files in the documentation directory. Currently, Antmarky handles the root directory level only, with no descendants (just yet).

## Features

* Zero configuration
* Fully responsive layout
* Fully static (doesn't require web server to work)
* No language frameworks included
* [Include remote Markdown files from GitHub and BitBucket][remote-md-files]
* [Markdown][markdown] flavor: `GitHub`. Supported syntax:
    * Heading ids
    * Emojis :tada:
    * Images with inline dimensions attributes
    * Reference links
    * Strikethrough
    * Subscript
    * Superscript
    * Tables
* [Admonitions][admonitions]
* [Syntax highlighting][syntax-highlight]
* [FontAwesome][fa]
* [Task lists][tasks-list]

[remote-md-files]: features.md#remote-markdown-files
[markdown]: markdown.md
[admonitions]: features.md#admonitions
[syntax-highlight]: features.md#syntax-highlighting
[fa]: features.md#fontawesome
[tasks-list]: features.md#task-lists