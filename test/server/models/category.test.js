import chai from 'chai';
import models from '../../../server/models';

const { Category } = models;
chai.should();

describe('Query the category table using model', () => {
  let category;
  before(async () => {
    category = await Category.findByPk(1);
  });

  it('should retrieve the first category', () => {
    category.dataValues.categoryName.should.equal('sports');
  });
});
