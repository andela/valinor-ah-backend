import chai from 'chai';
import models from '../../../server/models';

const { CommentLike, Comment } = models;
const should = chai.should();

describe('ensure comment table is created', () => {
  let result;
  before(async () => {
    result = await CommentLike.findAll();
  });
  it('should return id:1, commentId: 1, userId: 1', () => {
    should.equal(result[0].dataValues.id, 1);
    should.equal(result[0].dataValues.commentId, 4);
    should.equal(result[0].dataValues.userId, 1);
  });
});

describe('ensure after comment deletion comment like is deleted', () => {
  let result;
  before(async () => {
    await Comment.destroy({ where: { id: 4 } });
    result = await CommentLike.findAll();
  });
  it('should return id: 2, commentId: 1, userId: 2', () => {
    should.equal(result[0].dataValues.id, 2);
    should.equal(result[0].dataValues.commentId, 1);
    should.equal(result[0].dataValues.userId, 2);
  });
});
