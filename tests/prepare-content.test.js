const expect = require('chai').expect;
const assert = require('chai').assert;
const path = require('path');
const { findMdFiles } = require('../src/common/prepare-content');

describe('module findMdFiles', () => {
  it('Ensure the module works and returns a result', async () => {
    const files = await findMdFiles();
    expect(files).to.not.be.undefined;
  });

  it('Ensure the module outputs an array', async () => {
    const files = await findMdFiles();
    expect(files).to.be.an.instanceOf(Array);
  });
});
