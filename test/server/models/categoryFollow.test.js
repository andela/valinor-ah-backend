import chai from 'chai';
import models from '../../../server/models';

const { CategoryFollow } = models;
chai.should();

describe('Query the category follow table using model', () => {
  let follow;
  before(async () => {
    follow = await CategoryFollow.findByPk(1);
  });

  it('should retrieve the first category follow entry', () => {
    follow.dataValues.categoryId.should.equal(1);
    follow.dataValues.followerId.should.equal(1);
  });
});
