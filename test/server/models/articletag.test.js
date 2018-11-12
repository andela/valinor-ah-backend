import chai from 'chai';
import models from '../../../server/models';

const { ArticleTag } = models;
chai.should();

describe('Query the articletags table using model', () => {
  let articleTag;
  before(async () => {
    articleTag = await ArticleTag.findByPk(1);
  });

  it('should retrieve the first articletag', () => {
    articleTag.dataValues.articleId.should.equal(1);
    articleTag.dataValues.tagId.should.equal(1);
  });
});

describe('Create an entry', () => {
  let articleTag;
  before(async () => {
    articleTag = await ArticleTag.create({
      articleId: 3, tagId: 3
    });
  });

  it('should return created values', () => {
    articleTag.dataValues.articleId.should.equal(3);
    articleTag.dataValues.tagId.should.equal(3);
  });
});
