const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { buildStaticFiles } = require('../../src/common/prepare-content');
chai.use(chaiAsPromised);

describe('module buildStaticFiles', () => {
  it('Throw an error when passing documentatiom directory name of incorrect type', async () => {
    let incorrectDocsDirectory = [ ['one', 'two', 'three'], 77, { "name": "John" }];
    for (let input of incorrectDocsDirectory) {
      await expect(buildStaticFiles(input)).to.be.rejectedWith(`Error when building static files`);
    }
  });
});