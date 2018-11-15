import { assert } from 'chai';

import getCorrolatingTags from '../../../server/helpers/getCorrolatingTags';

const resultOne = getCorrolatingTags([[1, 3, 5], [1, 2, 3, 4, 5], [2, 3, 5]]);
const resultTwo = getCorrolatingTags([[1]]);
const resultThree = getCorrolatingTags([[1, 2]]);
describe('test getCorrolatingTags() function', () => {
  it('should return [3, 5]', () => {
    assert.deepEqual(resultOne, [3, 5]);
  });
  it('should return 1', () => {
    assert.equal(resultTwo, 1);
  });
  it('should return [1, 2]', () => {
    assert.deepEqual(resultThree, [1, 2]);
  });
});
