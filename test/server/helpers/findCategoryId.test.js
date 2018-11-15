import { assert } from 'chai';

import findCategoryId from '../../../server/helpers/findCategoryId';

let resultOne;
let resultTwo;
let resultThree;
let resultFour;
describe('test findCategoryId() function', () => {
  before(async () => {
    resultOne = await findCategoryId('fashion');
    resultTwo = await findCategoryId('sports');
    resultThree = await findCategoryId('technology');
    resultFour = await findCategoryId('kjnddlnf');
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
