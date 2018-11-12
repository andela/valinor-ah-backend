import chai from 'chai';
import models from '../../../server/models';

const { Comment } = models;
chai.should();
describe('Get one comment', () => {
  it('Get a comment by ID', () => {
    Comment
      .findByPk(1)
      .then((comment) => {
        comment.should.be.a('object');
        comment.id.should.be.eql(1);
        comment.userId.should.be.eql(1);
        comment.articleId.should.be.eql(1);
      })
      .catch(err => err);
  });
  it('Get a comment by ID', () => {
    Comment
      .findByPk(2)
      .then((comment) => {
        comment.should.be.a('object');
        comment.id.should.be.eql(2);
        comment.userId.should.be.eql(1);
        comment.articleId.should.be.eql(3);
      })
      .catch(err => err);
  });
  it('Get a comment by ID', () => {
    Comment
      .findByPk(3)
      .then((comment) => {
        comment.should.be.a('object');
        comment.id.should.be.eql(3);
        comment.userId.should.be.eql(2);
        comment.articleId.should.be.eql(2);
      })
      .catch(err => err);
  });
});
