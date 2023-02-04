import { describe, expect, test } from '@jest/globals';
import buildTableOfContents from '../../src/build-table-of-contents';

describe('module buildTableOfContents', () => {

  test('Should properly find all the headings from the html content', async () => {
    let htmlFragment =
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

    await expect(buildTableOfContents(htmlFragment)).resolves.toEqual(expectedResult);
  });

  test('Should return an empty array when no matches found', async () => {
    let htmlFragment =
      '<h2 id="features">Features</h2>\n' +
      '<div class="sectionbody">\n' +
      '<div class="sect2">\n' +
      '<h3><a class="anchor" href="#admonitions"></a>Admonitions</h3>\n' +
      '<div class="paragraph"><p>Supported admonitions: <code>NOTE</code>, <code>TIP</code>, <code>IMPORTANT</code>, <code>CAUTION</code>,\n' +
      '<code>WARNING</code>.</p></div>\n';

    await expect(buildTableOfContents(htmlFragment)).resolves.toEqual([]);
  });
});