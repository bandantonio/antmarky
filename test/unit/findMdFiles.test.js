const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { findMdFiles } = require('../../src/common/prepare-content');
chai.use(chaiAsPromised);

describe('module findMdFiles', () => {
  it('Ensure the module works and returns a result', async () => {
    const files = await findMdFiles();
    expect(files).to.not.be.undefined;
  });

  it('Ensure the module outputs an array', async () => {
    const files = await findMdFiles();
    expect(files).to.be.an.instanceOf(Array);
  });

  it('Throw an Error when docs directory name is invalid', async () => {
    const failedValue = 123;
    await expect(findMdFiles(failedValue)).to.be.rejectedWith('Invalid docs directory');
  });

  it(`Throw an Error when docs directory doesn't exist`, async () => {
    const failedDirectoryPath = 'nonexistentdirectory';
    await expect(findMdFiles(failedDirectoryPath)).to.be.rejectedWith('The specified directory does not exist');
  });
});
