const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');
const mock = require('mock-fs');
const { buildStaticFiles } = require('../../src/common/prepare-content');
chai.use(chaiAsPromised);

describe('module buildStaticFiles', () => {
  it('Throw an error when passing documentatiom directory name of incorrect type', async () => {
    let incorrectDocsDirectory = [ ['one', 'two', 'three'], 77, { "name": "John" }];
    for (let input of incorrectDocsDirectory) {
      await expect(buildStaticFiles(input)).to.be.rejectedWith(`Error when building static files`);
    }
  });
  
  before(async () => {
    mock({
      'docs': {
        'unit-test.md': '## Unit test 1\nUnit test 1 file content',
        'unit-test-2.md': '## Unit test 2\nUnit test 2 file content'
      },
      'docs/unit-sub-dir': {
        'unit-test-3.md': '## Unit test 3\nUnit test 3 file content'
      },
      'views': mock.load(path.resolve(process.cwd(), 'views')),
      'src/assets': mock.load(path.resolve(process.cwd(), 'src/assets')),
      'README.md': mock.load(path.resolve(process.cwd(), 'README.md'))
    });

    await buildStaticFiles();
  })
  it('Ensure the output directory contains generated static files', async () => {
    let files = fs.readdirSync(path.resolve('public'), 'utf-8');

    expect(files).to.be.an('array').that
      .includes.members(['css', 'index.html', 'unit-test.html', 'unit-test-2.html', 'unit-test-3.html', '404.html'])
      .but.not.includes.members(['unit-test-4.html']);

    expect(mock.bypass(() => fs.existsSync(path.resolve('public')))).to.be.false;
    mock.restore();
  });

  it.skip('Throw error when passed an incorrect filename');
});