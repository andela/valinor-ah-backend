import chai from 'chai';
import models from '../../../server/models';
import {
  articleWithValidData,
  articleWithInValidData
}
  from '../../../mockdata/articleMockData';

const { Article } = models;
chai.should();

describe('Testing article models - unit tests', () => {
  before((done) => {
    Article.destroy({ where: {} });
    done();
  });
  it(
    'should return created Article model upon article creation',
    (done) => {
      Article.create(articleWithValidData)
        .then((returnedArticle) => {
          returnedArticle.slug.should.be
            .eql(articleWithValidData.slug);
          returnedArticle.description.should.be
            .eql(articleWithValidData.description);
          returnedArticle.body.should.be
            .eql(articleWithValidData.body);
          returnedArticle.title.should.be
            .eql(articleWithValidData.title);
          Article.findOne({ where: { id: 1 } })
            .then((newArticle) => {
              newArticle.slug.should.be
                .eql(articleWithValidData.slug);
              newArticle.description.should.be
                .eql(articleWithValidData.description);
              newArticle.body.should.be
                .eql(articleWithValidData.body);
              newArticle.title.should.be
                .eql(articleWithValidData.title);
            });
        });
      done();
    }
  );
  it(
    'should throw error if created model fails validation',
    (done) => {
      Article.create(articleWithInValidData)
        .catch((err) => {
          err.name.should.be.eql('SequelizeValidationError');
          err.errors[0].message.should.be
            .eql('Article.slug cannot be null');
        });
      done();
    }
  );
});
