import { assert } from 'chai';

import fetchCategoryId from '../../../server/helpers/fetchCategoryId';

let resultOne;
let resultTwo;
let resultThree;
let resultFour;
describe('test findCategoryId() function', () => {
  before(async () => {
    resultOne = await fetchCategoryId('fashion');
    resultTwo = await fetchCategoryId('sports');
    resultThree = await fetchCategoryId('technology');
    resultFour = await fetchCategoryId('kjnddlnf');
  });
  it('should return 3', () => {
    assert.equal(resultOne, 3);
  });
  it('should return 1', () => {
    assert.equal(resultTwo, 1);
  });
  it('should return 2', () => {
    assert.equal(resultThree, 2);
  });
  it('should return error', () => {
    assert.equal(resultFour.message, 'this category does not exist');
  });
});
