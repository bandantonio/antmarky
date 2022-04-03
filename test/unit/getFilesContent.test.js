const chai = require('chai');
const { expect } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { getFilesContent } = require('../../src/common/prepare-content');
chai.use(chaiAsPromised);

describe('module getFilesContent', () => {
  it('Ensure the module throws an error when passing input of incorrect type', async () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      await expect(getFilesContent(value)).to.be.rejectedWith(`Can't get content from Markdown files`);
    }
  });
});