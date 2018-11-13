import chai from 'chai';
import models from '../../../server/models';

chai.should();

const { Bookmark } = models;

describe('Testing Bookmark model', () => {
  it('get a bookmark from bookmark table', (done) => {
    Bookmark.findByPk(1)
      .then((bookmrk) => {
        bookmrk.should.be.a('object');
        bookmrk.articleId.should.be.a('number');
        bookmrk.userId.should.be.a('number');
      });
    done();
  });
  it('get all bookmark for user 2', (done) => {
    Bookmark
      .findAndCountAll({
        where: {
          userId: 2
        }
      })
      .then((bookmarks) => {
        bookmarks.count.should.be.eql(2);
      });
    done();
  });
  it('get all bookmark for user 1', (done) => {
    Bookmark
      .findAndCountAll({
        where: {
          userId: 1
        }
      })
      .then((bookmarks) => {
        bookmarks.count.should.be.eql(2);
      });
    done();
  });
  it('add a new bookmark', (done) => {
    Bookmark.create({
      userId: 1,
      articleId: 15
    })
      .then((bookmrk) => {
        bookmrk.should.be.a('object');
        bookmrk.should.have.property('userId');
        bookmrk.should.have.property('articleId');
      });
    done();
  });
});
