import { assert } from 'chai';

import findTagArticle from '../../../server/helpers/findTagArticle';

let resultOne;
let resultTwo;
describe('test findTagArticle() function', () => {
  before(async () => {
    resultOne = await findTagArticle(1);
    resultTwo = await findTagArticle(8);
  });
  it('should return 3', () => {
    assert.deepEqual(resultOne, [1, 2, 3, 5, 19]);
  });
  it('should return 1', () => {
    assert.equal(
      resultTwo.message,
      'this tag does not match any existing article'
    );
  });
});
