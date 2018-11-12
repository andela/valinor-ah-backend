import chai from 'chai';
import models from '../../../server/models';
import {
  ratingWithValidData,
  ratingWithInvalidData
} from '../../../mockdata/ratingMockData';

const { Rating } = models;
chai.should();

describe('Test rating model - Unit tests', () => {
  it('should add a new article rating', (done) => {
    Rating.create(ratingWithValidData)
      .then((newRating) => {
        newRating
          .dataValues.rating.should.eql(ratingWithValidData.rating);
        newRating
          .dataValues.articleId.should.eql(ratingWithValidData.articleId);
        newRating
          .dataValues.userId.should.eql(ratingWithValidData.userId);
        Rating.findOne({ where: { id: 1 } })
          .then((rating) => {
            rating.dataValues.userId.should.be.eql(1);
            rating.dataValues.articleId.should.be.eql(1);
            rating.dataValues.rating.should.be.eql(5);
          });
        done();
      });
  });

  it('should throw error ', (done) => {
    Rating.create(ratingWithInvalidData)
      .catch((err) => {
        err.name.should.eql('SequelizeDatabaseError');
      });
    done();
  });
});
