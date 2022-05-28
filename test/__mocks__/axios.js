const get = url => {
  if (url === 'https://github.com/bandantonio/bandantonio.github.io/raw/main/README.md') {
    
    let githubResponse = '# mister-gold.pro\n' +
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
    '[![Lighthouse](https://img.shields.io/badge/-SEO:100-white?style=flat&logo=Lighthouse&logoColor=red)](https://mister-gold.pro)\n';

    return Promise.resolve({ data: githubResponse });

  } else if (url === 'https://bitbucket.org/stephendeutsch/confluence-user-macros/raw/master/README.md') {

    let bitbucketResponse = '# Confluence User Macros #\n' +
    '\n' +
    'These are a couple of user macros that I have created for Confluence in order to add new features or make administration easier.\n' +
    '\n' +
    'They have not been thoroughly tested, but they should work at least on all versions from 5.0 - 5.4.4.\n' +
    '\n' +
    'If you find any issues, please [let me know](mailto:stephen.deutsch@zanox.com).\n' +
    '\n' +
    'I am making these available for free under the [Apache license](http://www.apache.org/licenses/LICENSE-2.0.html), but if you find any of them useful, consider [making a donation via Paypal.](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=8Z6CHCT4XCLPA&lc=US&item_name=Stephen%20Deutsch&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)';

    return Promise.resolve({ data: bitbucketResponse })
  } else {
    return Promise.reject({
      error: 'Test error from mocked Axios'
    })
  }
}

module.exports.get = get;