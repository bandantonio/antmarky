# Markdown support

Antmarky uses `GitHub` flavor for the Markdown parser. The parser supports the following syntax:

* [Automatic heading ids](#automatic-heading-ids)
* [Emojis](#emojis) :tada:
* [Images with inline dimensions attributes](#image-dimensions)
* [Reference links](#reference-links)
* [Strikethrough](#strikethrough)
* [Subscript](#subscript)
* [Superscript](#superscript)
* [Tables](#tables)

## Automatic heading ids

The following heading:

```md
# Automatic heading ids
```

will automatically be transformed into the following HTML:

```html
<a href="#automatic-heading-ids">Automatic heading ids</a>
```

## Emojis

```md
Learning JavaScript is :no_entry_sign: a :rocket: :man_scientist:
```

Learning JavaScript is :no_entry_sign: a :rocket: :man_scientist:

## Image dimensions

```md
![Alt text](url/to/image =250x250 "Optional title")
```

## Reference links

```md
[Link to google][refer]

[refer]: https://google.com
```

## Strikethrough

```md
a ~~strikethrough~~ element
```

a ~~strikethrough~~ element

## Subscript

```md
H~2~O
```

H~2~O

## Superscript

```md
x^2^ * y^2^
```

x^2^ * y^2^

## Tables

```md
| Tables    | Are            | Cool  |
|-----------|:--------------:|------:|
| **row 1** | center-aligned | $1000 |
| row 2     | *centered*     |   $10 |
| row 3     | ~~centered~~   |    $1 |
```

| Tables    | Are            | Cool  |
|-----------|:--------------:|------:|
| **row 1** | center-aligned | $1000 |
| row 2     | *centered*     |   $10 |
| row 3     | ~~centered~~   |    $1 |