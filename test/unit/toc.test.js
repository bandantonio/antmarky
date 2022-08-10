const { buildToc } = require('../../src/toc');

describe('module buildToc', () => {
  test('Throw error when passing input of incorrect type', () => {
    let inputOfIncorrectType = [['one', 'two', 'three'], 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      expect(() => buildToc(value)).toThrowError(`Can't build table of contents, the provided content is invalid`);
    }
  });

  test('Should return headings in proper format', () => {
    let properHtml =
      '<h1 id="features">Features</h1>\n' +
      '<h2 id="remote-markdown-files">Remote markdown files</h2>\n' +
      '<p>You can include remote Markdown files in <strong>raw</strong> format from <strong>GitHub</strong> and <strong>BitBucket</strong> public repositories using <code>!!+</code> directive</p>\n' +
      '<pre data-language="js"><code class="js language-js">let greeting = \'Hello World!\';\n' +
      'console.log(greeting);\n' +
      '</code></pre>\n' +
      '<h3 id="syntax-highlighting">Syntax highlighting</h3>\n' +
      '<h1 id="markdown-support">Markdown support</h1>\n' +
      '<p>Antmarky uses <code>GitHub</code> flavor for the Markdown parser. The parser supports the following syntax:</p>\n' +
      '<h2 id="heading-ids">Heading ids</h2>\n' +
      '<h1 id="hello-world">Hello World</h1>';

    expect(buildToc(properHtml)).toBeInstanceOf(Array);
  });

  test('Should properly find all the headings from the html content', () => {
    let htmlPiece =
    '<h2 id="features"><a class="anchor" href="#features"></a>Features</h2>\n' +
    '<div class="sectionbody">\n' +
    '<div class="sect2">\n' +
    '<h3 id="admonitions"><a class="anchor" href="#admonitions"></a>Admonitions</h3>\n' +
    '<div class="paragraph"><p>Supported admonitions: <code>NOTE</code>, <code>TIP</code>, <code>IMPORTANT</code>, <code>CAUTION</code>,\n' +
    '<code>WARNING</code>.</p></div>\n' +
    '<div class="admonitionblock note"><table><tr>\n' +
    '<td class="icon">\n' +
    '<i class="fa icon-note" title="Note"></i></td>\n' +
    '<td class="content">\n' +
    '<div class="listingblock">\n' +
    '<div class="content">\n' +
    '<pre class="highlight"><code class="language-md" data-lang="md">NOTE: Note admonition body</code></pre>\n' +
    '</div></div></td></tr></table></div></div>\n' +
    '<div class="sect2">\n' +
    '<h3 id="fontawesome"><a class="anchor" href="#fontawesome"></a>FontAwesome</h3>\n' +
    '<div class="paragraph">\n' +
    '<p>Antmarky supports <a href="https://fontawesome.com/v4/cheatsheet/" target="_blank" rel="noopener">FontAwesome v4.7</a> for compatibility reasons.</p>\n' +
    '</div>\n' +
    '<div class="paragraph">\n' +
    '<p>To use icons in the document, use the following syntax:</p>\n' +
    '</div>\n' +
    '<div class="listingblock">\n' +
    '<div class="content">\n' +
    '<pre class="highlight"><code class="language-plaintext" data-lang="plaintext">icon:bicycle[] is good for your icon:heart[]</code></pre>\n' +
    '</div></div>\n' +
    '<div class="paragraph">\n' +
    '<p>This will be rendered as: <span class="icon"><i class="fa fa-bicycle"></i></span> is good for your <span\n' +
    'class="icon"><i class="fa fa-heart"></i></span></p>\n' +
    '</div></div></div></div>';

    let expectedResult = [
      { id: '2', link: 'features', title: 'Features' },
      { id: '3', link: 'admonitions', title: 'Admonitions' },
      { id: '3', link: 'fontawesome', title: 'FontAwesome' }
    ];

    expect(buildToc(htmlPiece)).toEqual(expectedResult);
  });

  test.todo('Should there be a test to check for accidental tags mismatch?');

});