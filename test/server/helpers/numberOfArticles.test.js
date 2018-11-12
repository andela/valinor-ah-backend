import { assert } from 'chai';

import numberOfArticles from '../../../server/helpers/numberOfArticles';

const resultOne = numberOfArticles(32, 10, 1);
const resultTwo = numberOfArticles(28, 10, 3);
const resultThree = numberOfArticles(32, 10, 4);
const resultFour = numberOfArticles(32, 10, 5);
describe('test numberOfArticles() function', () => {
  it('should return 10', () => {
    assert.equal(resultOne, 10);
  });
  it('should return 8', () => {
    assert.equal(resultTwo, 8);
  });
  it('should return 2', () => {
    assert.equal(resultThree, 2);
  });
  it('should return 0', () => {
    assert.equal(resultFour, 0);
  });
});
