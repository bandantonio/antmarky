const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { embedRemoteMarkdown } = require('../../src/common/embed-remote-markdown');
chai.use(chaiAsPromised);

describe('module embedRemoteMarkdown', () => {
  it('Throw an error when passing input of incorrect type', async () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      await expect(embedRemoteMarkdown(value)).to.be.rejectedWith('Cannot search for remote URLs. The provided content is invalid');
    }
  });

  it('Throw an error when passing an empty input', async () => {
    await expect(embedRemoteMarkdown()).to.be.rejectedWith('Cannot search for remote URLs. The provided content is invalid');
  });

  it('Throw an error when trying to fetch an invalid remote content URL', async () => {
    let markdownWithBrokenRemoteURL = [{
      name: 'markdown with broken url',
      title: 'markdown with broken url',
      content:
      '## Remote markdown files\n' +
      'You can include remote Markdown files in **raw** format from **GitHub** and **BitBucket** public repositories using `!!+` directive:\n' +
      '!!+ github.com/link/to/your/raw/markdown/file.md\n' +
      '!!+ bitbucket.org/link/to/your/raw/markdown/file.md\n' +
      '!!+ https://github.com/<username>/<repo>/raw/<branch>/filename.md\n'
    }]
    await expect(embedRemoteMarkdown(markdownWithBrokenRemoteURL)).to.be.rejectedWith('Cannot retrieve the remote content. Something wrong with the URL.');
  });

  it('Throw an error when a URL is rejected by validation', async () => {
    let markdownWithInvalidRemoteURLs = [{
      name: 'markdown with broken url',
      title: 'markdown with broken url',
      content:
      '## Remote markdown files\n' +
      'You can include remote Markdown files in **raw** format from **GitHub** and **BitBucket** public repositories using `!!+` directive:\n' +
      '!!+ github.com/link/to/your/raw/markdown/file.md\n' +
      '!!+ bitbucket.org/link/to/your/raw/markdown/file.md\n' +
      '!!+ https://github.com/bandantonio/antmarky/edit/main/README.md\n' +
      '!!+ https://github.com/bandantonio/antmarky/blob/main/README.md\n' +
      '!!+ https://bitbucket.org/stephendeutsch/confluence-user-macros/src/master/README.md\n'
    }]
    await expect(embedRemoteMarkdown(markdownWithInvalidRemoteURLs)).to.be.rejectedWith('Cannot retrieve the remote content. Something wrong with the URL.');
  });

  it('Embed remote content from GitHub into the doc', async () => {
    let markdownWithSuitableGitHubURL = [    {
      name: 'remote-github',
      title: 'remote-github',
      content:
      '## Remote content from GitHub\n' +
      'Antmarky is a static-site generator for Markdown based on Node.js/EJS.\n' +
      '\n' +
      '!!+ https://github.com/bandantonio/bandantonio.github.io/raw/main/README.md\n' +
      '\n' +
      'Zero configuration\n' +
      '\n' +
      'The main idea behind creating Antmarky was to have a generator with zero configuration that can serve your Markdown files in the documentation directory.'
    }];
    let expectedGitHubContent = [{
      name: 'remote-github',
      title: 'remote-github',
      content:
      '## Remote content from GitHub\n' +
      'Antmarky is a static-site generator for Markdown based on Node.js/EJS.\n' +
      '\n' +
      '# mister-gold.pro\n' +
      '\n' +
      '[Personal website of Anton Zolotukhin](https://mister-gold.pro)\n' +
      '\n' +
      '----\n' +
      '\n' +
      '[![Deploy to GitHub Pages](https://github.com/bandantonio/bandantonio.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/bandantonio/bandantonio.github.io/actions/workflows/deploy.yml)\n' +
      '\n' +
      'My personal website built with [Hexo](https://hexo.io), [EJS](https://ejs.co), and [GitHub Pages](https://pages.github.com).\n' +
      '\n' +
      '## Lighthouse Score\n' +
      '\n' +
      '[![Lighthouse](https://img.shields.io/badge/-Performance:97-white?style=flat&logo=Lighthouse&logoColor=red)](https://mister-gold.pro)\n' +
      '[![Lighthouse](https://img.shields.io/badge/-Accessibility:100-white?style=flat&logo=Lighthouse&logoColor=red)](https://mister-gold.pro)\n' +
      '[![Lighthouse](https://img.shields.io/badge/-Best%20Practices:100-white?style=flat&logo=Lighthouse&logoColor=red)](https://mister-gold.pro)\n' +
      '[![Lighthouse](https://img.shields.io/badge/-SEO:100-white?style=flat&logo=Lighthouse&logoColor=red)](https://mister-gold.pro)\n' +
      '\n' +
      '\n' +
      'Zero configuration\n' +
      '\n' +
      'The main idea behind creating Antmarky was to have a generator with zero configuration that can serve your Markdown files in the documentation directory.'
    }];
    let resultingRemoteContent = await embedRemoteMarkdown(markdownWithSuitableGitHubURL);
    expect(resultingRemoteContent).to.eql(expectedGitHubContent);
  });

  it('Embed remote content from BitBucket into the doc', async () => {
    let markdownWithSuitableBitBucketURL = [{
      name: 'remote-bitbucket',
      title: 'remote-bitbucket',
      content:
      '## Remote content from Bitbucket\n' +
      'Some basic text\n' +
      '## Remote markdown files\n' +
      'You can include remote Markdown files in **raw** format from **GitHub** and **BitBucket** public repositories using `!!+` directive:\n' +
      '!!+ github.com/link/to/your/raw/markdown/file.md\n' +
      '!!+ bitbucket.org/link/to/your/raw/markdown/file.md\n' +
      '!!+ https://bitbucket.org/stephendeutsch/confluence-user-macros/raw/master/README.md'
    }];
    let expectedBitBucketContent = [{
      name: 'remote-bitbucket',
      title: 'remote-bitbucket',
      content:
      '## Remote content from Bitbucket\n' +
      'Some basic text\n' +
      '## Remote markdown files\n' +
      'You can include remote Markdown files in **raw** format from **GitHub** and **BitBucket** public repositories using `!!+` directive:\n' +
      '!!+ github.com/link/to/your/raw/markdown/file.md\n' +
      '!!+ bitbucket.org/link/to/your/raw/markdown/file.md\n' +
      '# Confluence User Macros #\n' +
      '\n' +
      'These are a couple of user macros that I have created for Confluence in order to add new features or make administration easier.\n' +
      '\n' +
      'They have not been thoroughly tested, but they should work at least on all versions from 5.0 - 5.4.4.\n' +
      '\n' +
      'If you find any issues, please [let me know](mailto:stephen.deutsch@zanox.com).\n' +
      '\n' +
      'I am making these available for free under the [Apache license](http://www.apache.org/licenses/LICENSE-2.0.html), but if you find any of them useful, consider [making a donation via Paypal.](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=8Z6CHCT4XCLPA&lc=US&item_name=Stephen%20Deutsch&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)'
    }];
    let resultingRemoteContent = await embedRemoteMarkdown(markdownWithSuitableBitBucketURL);
    expect(resultingRemoteContent).to.eql(expectedBitBucketContent);
  });

  it('Pass content "as is" if no remote content found (URLs skipped)', async () => {
    let markdownWithGeneralURLs = [{
      name: 'text-with-random-valid-urls',
      title: 'text-with-random-valid-urls',
      content:
      '## Faveas et conveniet oblitus ima properatis libet\n' +
      '\n' +
      'Lorem markdownum gerens? Hac tyranni crudelis pater, atria nec fiducia *tibi*:\n' +
      'hanc inplicuit potest. Non [At tanges](http://www.tamen.net/hectoris) florentis,\n' +
      'iusque, iam vetus Semeleia duxere sed alveus petit vel: de.\n' +
      '\n' +
      'https://github.com/username/repo/raw/branch/filname.md\n' +
      '\n' +
      'Laevaque Rhoetei\n' +
      'hostem, confesso fixis, iterumque torto cruore et pennis nostris aliquis quam\n' +
      'cura aut sic.\n' +
      '\n' +
      'https://google.com\n' +
      '\n' +
      '1. Vix frontis secernit concentu natusque manu\n' +
      '2. Versus omne extemplo agrestes\n' +
      '3. Triennia obsessae madida\n' +
      '\n' +
      'https://mister-gold.pro/antmarky\n' +
      '\n' +
      'Pennaeque Tempe [arbore Achelous](http://carcere.io/unda-et) vetat saltu, est\n' +
      'est ille? Caelo scire saepe tellus ducum at potest senior et novavit! Invenit\n' +
      'mille restat sororum, plus Inachides parenti belua, lato floresque magis.'
    }];

    let expectedGeneralContent = markdownWithGeneralURLs;
    
    let resultingRemoteContent = await embedRemoteMarkdown(markdownWithGeneralURLs);
    expect(resultingRemoteContent).to.eql(expectedGeneralContent);
  });
});