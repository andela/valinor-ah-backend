import chai from 'chai';
import models from '../../../server/models';

const { ArticleLike } = models;
chai.should();

describe('Get one article likes value', () => {
  it('get the first record from ArticleLikes table', (done) => {
    ArticleLike
      .findByPk(1)
      .then((like) => {
        like.should.be.a('object');
        like.id.should.be.eql(1);
        like.userId.should.be.eql(1);
        like.articleId.should.be.eql(1);
        like.status.should.be.eql(false);
        done();
      })
      .catch(err => err);
  });
  it('get the second record from ArticleLikes table', (done) => {
    ArticleLike
      .findByPk(2)
      .then((like) => {
        like.should.be.a('object');
        like.id.should.be.eql(2);
        like.userId.should.be.eql(1);
        like.articleId.should.be.eql(2);
        like.status.should.be.eql(true);
        done();
      })
      .catch(err => err);
  });
});
