# Antmarky

Antmarky is a static-site generator for Markdown based on Node.js/EJS.

[![antmarky](https://github.com/bandantonio/antmarky/actions/workflows/antmarky.yml/badge.svg?branch=main)](https://github.com/bandantonio/antmarky/actions/workflows/antmarky.yml) [![Coverage Status](https://coveralls.io/repos/github/bandantonio/antmarky/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/bandantonio/antmarky?branch=main) ![Docker Pulls](https://img.shields.io/docker/pulls/bandantonio/antmarky) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-f7df1e.svg)](https://github.com/standard/semistandard)

The main idea behind creating Antmarky was to have a generator with *zero configuration* that can serve your Markdown files in the documentation directory. Currently, Antmarky flattens out the directory structure and displays all the files at the root level under the corresponding directory.

## Features

* Zero configuration
* Fully responsive layout
* Fully static (doesn't require a web server to work)
* No language frameworks included
* [Include remote Markdown files from GitHub and BitBucket][remote-md-files]
* [Markdown][markdown] flavor: `GitHub`. Supported syntax:
    * Heading ids
    * Emojis :tada:
    * Images with inline dimensions attributes
    * Reference links
    * Strikethrough
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

## Quickstart

### Prerequisites

* [Docker](https://docs.docker.com/get-docker/)

### Serve content

```sh
docker run --rm \
  --name antmarky-ssg \
  -v ${PWD}/docs:/antmarky/docs \
  -p 8000:8000 \
  bandantonio/antmarky
```

Local server will be launched at `http://localhost:8000`.

### Build content

```sh
docker run --rm \
  --name antmarky-ssg \
  -v ${PWD}/docs:/antmarky/docs \
  -v ${PWD}/public:/antmarky/public \
  bandantonio/antmarky build
```

Website static files will be generated in the `public` directory.
