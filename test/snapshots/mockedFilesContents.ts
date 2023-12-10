import FileContent from "../../src/schemas/fileContent";

const mockedFilesContents: FileContent[] = [
  {
    "fileName": "apple1",
    "fileTitle": "Apple1",
    "fileRelativeDir": "",
    "fileHtmlContent": "<div class=\"sect1\">\n<h2 id=\"overview\"><a class=\"anchor\" href=\"#overview\"></a>1. Overview</h2>\n<div class=\"sectionbody\">\n<div class=\"paragraph\">\n<p>This is a sample AsciiDoc document with Sections and Lists</p>\n</div>\n<div class=\"ulist\">\n<ul>\n<li>\n<p>Point A</p>\n</li>\n<li>\n<p>Point B</p>\n</li>\n<li>\n<p>Point C</p>\n</li>\n</ul>\n</div>\n<div class=\"sect2\">\n<h3 id=\"section-1\"><a class=\"anchor\" href=\"#section-1\"></a>1.1. Section 1</h3>\n<div class=\"paragraph\">\n<p>This is the content of section 1.</p>\n</div>\n<div class=\"sect3\">\n<h4 id=\"subsection-1-1\"><a class=\"anchor\" href=\"#subsection-1-1\"></a>1.1.1. Subsection 1.1</h4>\n<div class=\"ulist\">\n<ul>\n<li>\n<p>Point 1</p>\n</li>\n<li>\n<p>Point 2</p>\n</li>\n<li>\n<p>Point 3</p>\n</li>\n</ul>\n</div>\n</div>\n</div>\n<div class=\"sect2\">\n<h3 id=\"section-2\"><a class=\"anchor\" href=\"#section-2\"></a>1.2. Section 2</h3>\n<div class=\"paragraph\">\n<p>This is the content of section 2.</p>\n</div>\n<div class=\"sect3\">\n<h4 id=\"subsection-2-1\"><a class=\"anchor\" href=\"#subsection-2-1\"></a>1.2.1. Subsection 2.1</h4>\n<div class=\"olist arabic\">\n<ol class=\"arabic\">\n<li>\n<p>Point A</p>\n</li>\n<li>\n<p>Point B</p>\n</li>\n<li>\n<p>Point C</p>\n</li>\n</ol>\n</div>\n<div class=\"admonitionblock note\">\n<table>\n<tr>\n<td class=\"icon\">\n<i class=\"fa icon-note\" title=\"Note\"></i>\n</td>\n<td class=\"content\">\n<div class=\"paragraph\">\n<p>Testing different features.</p>\n</div>\n</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n</div>\n</div>",
    "tableOfContents": [
      {
        "id": "overview",
        "title": "Overview",
        "level": 1
      },
      {
        "id": "section-1",
        "title": "Section 1",
        "level": 2
      },
      {
        "id": "subsection-1-1",
        "title": "Subsection 1.1",
        "level": 3
      },
      {
        "id": "section-2",
        "title": "Section 2",
        "level": 2
      },
      {
        "id": "subsection-2-1",
        "title": "Subsection 2.1",
        "level": 3
      }
    ]
  },
  {
    "fileName": "google-two",
    "fileTitle": "Google-Two",
    "fileRelativeDir": "sub",
    "fileHtmlContent": "<div class=\"sect1\">\n<h2 id=\"getting-started\"><a class=\"anchor\" href=\"#getting-started\"></a>Getting Started</h2>\n<div class=\"sectionbody\">\n<div class=\"paragraph\">\n<p>This document is a quick guide for testing.</p>\n</div>\n<div class=\"listingblock\">\n<div class=\"content\">\n<pre class=\"highlight\"><code class=\"language-java\" data-lang=\"java\">System.out.println(\"Hello, World!\");</code></pre>\n</div>\n</div>\n<div class=\"listingblock\">\n<div class=\"content\">\n<pre class=\"highlight\"><code class=\"language-javascript\" data-lang=\"javascript\">console.log(\"Hello, World!\");</code></pre>\n</div>\n</div>\n<div class=\"admonitionblock important\">\n<table>\n<tr>\n<td class=\"icon\">\n<i class=\"fa icon-important\" title=\"Important\"></i>\n</td>\n<td class=\"content\">\n<div class=\"paragraph\">\n<p>Code snippets included.</p>\n</div>\n</td>\n</tr>\n</table>\n</div>\n</div>\n</div>",
    "tableOfContents": [
      {
        "id": "getting-started",
        "title": "Getting Started",
        "level": 1
      }
    ]
  },
  {
    "fileName": "index",
    "fileTitle": "Index",
    "fileRelativeDir": "",
    "fileHtmlContent": "<div class=\"sect1\">\n<h2 id=\"introduction\"><a class=\"anchor\" href=\"#introduction\"></a>Introduction</h2>\n<div class=\"sectionbody\">\n<div class=\"paragraph\">\n<p>This is a sample AsciiDoc document with a title and a paragraph of text.</p>\n</div>\n<div class=\"paragraph\">\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n</div>\n<div class=\"admonitionblock tip\">\n<table>\n<tr>\n<td class=\"icon\">\n<i class=\"fa icon-tip\" title=\"Tip\"></i>\n</td>\n<td class=\"content\">\n<div class=\"paragraph\">\n<p>Keep it simple.</p>\n</div>\n</td>\n</tr>\n</table>\n</div>\n</div>\n</div>\n<div class=\"sect1\">\n<h2 id=\"test-section\"><a class=\"anchor\" href=\"#test-section\"></a>Test Section</h2>\n<div class=\"sectionbody\">\n<div class=\"paragraph\">\n<p>Some random content</p>\n</div>\n</div>\n</div>",
    "tableOfContents": [
      {
        "id": "introduction",
        "title": "Introduction",
        "level": 1
      },
      {
        "id": "test-section",
        "title": "Test Section",
        "level": 1
      }
    ]
  },
  {
    "fileName": "microsoft_three",
    "fileTitle": "Microsoft_three",
    "fileRelativeDir": "sub/sub-folder",
    "fileHtmlContent": "<div class=\"sect1\">\n<h2 id=\"detailed-description\"><a class=\"anchor\" href=\"#detailed-description\"></a>Detailed Description</h2>\n<div class=\"sectionbody\">\n<div class=\"paragraph\">\n<p>This manual is intended for thorough testing.</p>\n</div>\n<div class=\"paragraph\">\n<p>This is a link to [Google](<a href=\"https://www.google.com/\" class=\"bare\">https://www.google.com/</a>).</p>\n</div>\n<div class=\"imageblock\">\n<div class=\"content\">\n<img src=\"https://example.com/image.png\" alt=\"image\">\n</div>\n</div>\n<div class=\"admonitionblock caution\">\n<table>\n<tr>\n<td class=\"icon\">\n<i class=\"fa icon-caution\" title=\"Caution\"></i>\n</td>\n<td class=\"content\">\n<div class=\"paragraph\">\n<p>Handle with care.</p>\n</div>\n</td>\n</tr>\n</table>\n</div>\n</div>\n</div>",
    "tableOfContents": [
      {
        "id": "detailed-description",
        "title": "Detailed Description",
        "level": 1
      }
    ]
  },
  {
    "fileName": "netflix.four",
    "fileTitle": "Netflix.Four",
    "fileRelativeDir": "sub/sub-folder/sub-sub-folder",
    "fileHtmlContent": "<div class=\"sect1\">\n<h2 id=\"simple-table\"><a class=\"anchor\" href=\"#simple-table\"></a>Simple Table</h2>\n<div class=\"sectionbody\">\n<table class=\"tableblock frame-all grid-all stretch\">\n<colgroup>\n<col style=\"width: 33.3333%;\">\n<col style=\"width: 33.3333%;\">\n<col style=\"width: 33.3334%;\">\n</colgroup>\n<thead>\n<tr>\n<th class=\"tableblock halign-left valign-top\">Header 1</th>\n<th class=\"tableblock halign-left valign-top\">Header 2</th>\n<th class=\"tableblock halign-left valign-top\">Header 3</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td class=\"tableblock halign-left valign-top\"><p class=\"tableblock\">Cell 1.1</p></td>\n<td class=\"tableblock halign-left valign-top\"><p class=\"tableblock\">Cell 1.2</p></td>\n<td class=\"tableblock halign-left valign-top\"><p class=\"tableblock\">Cell 1.3</p></td>\n</tr>\n<tr>\n<td class=\"tableblock halign-left valign-top\"><p class=\"tableblock\">Cell 2.1</p></td>\n<td class=\"tableblock halign-left valign-top\"><p class=\"tableblock\">Cell 2.2</p></td>\n<td class=\"tableblock halign-left valign-top\"><p class=\"tableblock\">Cell 2.3</p></td>\n</tr>\n</tbody>\n</table>\n<div class=\"admonitionblock warning\">\n<table>\n<tr>\n<td class=\"icon\">\n<i class=\"fa icon-warning\" title=\"Warning\"></i>\n</td>\n<td class=\"content\">\nWolpertingers are known to nest in server racks.\nEnter at your own risk.\n</td>\n</tr>\n</table>\n</div>\n</div>\n</div>",
    "tableOfContents": [
      {
        "id": "simple-table",
        "title": "Simple Table",
        "level": 1
      }
    ]
  }
]

export default mockedFilesContents;