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
    '<h1 id="hello-world">Hello World</h1>\n' +
    '<h1 id="features">Features</h1>\n' +
    '<h2 id="features-two"></h2>\n' +
    '<h2>Remote markdown files</h2>\n' +
    '<p>You can include remote Markdown files in <strong>raw</strong> format from <strong>GitHub</strong> and <strong>BitBucket</strong> public repositories using <code>!!+</code> directive</p>\n' +
    '<pre data-language="js"><code class="js language-js">let greeting = \'Hello World!\';\n' +
    'console.log(greeting);\n' +
    '</code></pre>\n' +
    '<h7 id="syntax-highlighting-bad"></h7>\n' +
    '<h4 id="syntax-highlighting-ok">Syntax</h4>\n' +
    '<h6 id="markdown-support">Markdown support</h6>\n' +
    '<p>Antmarky uses <code>GitHub</code> flavor for the Markdown parser. The parser supports the following syntax:</p>\n' +
    '<h5 id="heading-ids">Heading ids</h5>\n' +
    '<h1 id="hello-world">Hello World</h1>';

    let expectedResult = [
      { id: '2', link: 'remote-markdown-files', title: 'Remote markdown files' },
      { id: '3', link: 'syntax-highlighting', title: 'Syntax highlighting' },
      { id: '2', link: 'heading-ids', title: 'Heading ids' },
      { id: '2', link: 'features-two', title: '' },
      { id: '4', link: 'syntax-highlighting-ok', title: 'Syntax' },
      { id: '6', link: 'markdown-support', title: 'Markdown support' },
      { id: '5', link: 'heading-ids', title: 'Heading ids' },
    ];

    expect(buildToc(htmlPiece)).toEqual(expectedResult);
  });

  test.todo('Should there be a test to check for accidental tags mismatch?');

});