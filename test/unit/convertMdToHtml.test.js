const expect = require('chai').expect
const { convertMdToHtml } = require('../../src/common/prepare-content');

describe('module convertMdToHtml', () => {
  it('Ensure the module throws an error when passing input of incorrect type', () => {
    let inputOfIncorrectType = ['string', 77, { "name": "John" }];
    for (let value of inputOfIncorrectType) {
      expect(() => convertMdToHtml(value)).to.throw(`Can't convert. Input data is invalid`);
    }
  });
});