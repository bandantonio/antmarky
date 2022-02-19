# Features

## Remote markdown files

You can include remote Markdown files in **raw** format from **GitHub** and **BitBucket** public repositories using `!!+` directive:

```md
!!+ github.com/link/to/your/raw/markdown/file.md
!!+ bitbucket.org/link/to/your/raw/markdown/file.md
```

::: tip "What is raw format"
**GitHub raw format**

```
https://github.com/<username>/<repo>/raw/<branch>/filename.md
```

**BitBucket raw format**

```
https://bitbucket.org/<username>/<repo>/raw/<branch>/filename.md
```
:::

## Admonitions

**info**

```md
::: info "Test info"
Info admonition body
:::
```

**warning**

```md
::: warning "Test warning"
Warning admonition body
:::
```

**danger**

```md
::: danger "Test danger"
Danger admonition body
:::
```

**tip**

```md
::: tip "Test tip"
Tip admonition body
:::
```

**secondary**

```md
::: secondary "Test secondary"
Secondary admonition body
:::
```

### Example

::: info "Test info"
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean interdum ullamcorper nibh sed bibendum. Fusce consectetur, velit eu tempus consequat, enim libero consequat sem, `vitae` interdum velit urna eget nunc.

Sed mollis sed turpis in porttitor. Fusce ac `lectus turpis`. Fusce tortor arcu, eleifend nec elit id, sagittis sodales velit. Vestibulum pretium tortor metus, a sollicitudin velit facilisis ut.

`test code line`

```js
let greeting = 'Hello World!';

console.log(greeting);
```
:::

## Syntax highlighting

Antmarky uses [Highlight.js](https://highlightjs.org) for syntax highlighting. The bundle includes a set of common languages. Other languages can be added on request.

## FontAwesome

Antmarky supports the latest version of [FontAwesome icon set](https://fontawesome.com/v6.0/icons?m=free).

## Task lists

```md
 - [x] checked list item
 - [ ] unchecked list item
```

 - [x] checked list item
 - [ ] unchecked list item