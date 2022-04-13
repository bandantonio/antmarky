const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mock = require('mock-fs');
const { findMdFiles } = require('../../src/common/prepare-content');
chai.use(chaiAsPromised);

describe('module findMdFiles', () => {

  it('Ensure the module outputs an array (default `docs` directory)', async () => {
    const files = await findMdFiles();
    expect(files).to.be.an('array');
  }).title

  it.skip('Ensure the module outputs an array (custom `docs` directory)', async () => {
    const files = await findMdFiles();
    expect(files).to.be.an('array');
  });

  it('Ensure the module outputs an array (root directory)', async () => {
    const files = await findMdFiles('/');
    expect(files).to.be.an('array');
  });

  it('Ensure the module outputs an array of expected format (default `docs` directory)', async () => {
    const files = await findMdFiles();
    files.map(obj => (expect(obj).to.include.all.keys(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files'])))
  });

  it.skip('Ensure the module outputs an array of expected format (custom `docs` directory)', async () => {
    const files = await findMdFiles();
    files.map(obj => (expect(obj).to.include.all.keys(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files'])))
  });

  it('Ensure the module outputs an array of expected format (root directory)', async () => {
    const files = await findMdFiles('/');
    files.map(obj => (expect(obj).to.include.all.keys(['dirLevel', 'basePath', 'dirPath', 'dirClass', 'dirName', 'files'])))
  });

  it('Throw an error when docs directory name is invalid', async () => {
    const failedValue = 123;
    await expect(findMdFiles(failedValue)).to.be.rejectedWith('Invalid docs directory');
  });

  it(`Throw an error when the specified docs directory doesn't exist`, async () => {
    const failedDirectoryPath = 'nonexistentdirectory';
    await expect(findMdFiles(failedDirectoryPath)).to.be.rejectedWith('The specified directory does not exist');
  });

  describe.skip('module findMdFiles - working with files', () => {
    it('Output files from the root docs directory', async () => {
      mock({
        'fake-root-one.md': `# Title\nHello world from the fake-root-one file`,
        'fake-root-two.md': `# Title\nHello world from the fake-root-two file`,
      });

      let result = await findMdFiles('/');
      expect(result.map(obj => obj.files)).to.deep.include(['fake-root-one', 'fake-root-two'])
      mock.restore();
    });
    
    it(`Output files from the default docs directory`, async () => {
      mock({
        'docs': {
          'fake-docs-dir-one.md': `# Title\nHello world from the fake-docs-dir-one file`,
          'fake-docs-dir-two.md': `# Title\nHello world from the fake-docs-dir-two file`,
        }
      });

      let result = await findMdFiles();
      expect(result).to.be.an('array').that.includes.ordered.members([ 'fake-docs-dir-one.md', 'fake-docs-dir-two.md' ]);
      mock.restore();
    });
  });
});
