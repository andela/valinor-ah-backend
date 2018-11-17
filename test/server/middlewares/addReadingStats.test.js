import chaiHttp from 'chai-http';
import chai from 'chai';

import models from '../../../server/models';

const { User, ReadingStats } = models;

chai.use(chaiHttp);

describe('should increase readStats by 1', () => {
  let read;
  let statsArticleId;
  let statsUserId;
  before(async () => {
    const result = await User
      .findByPk(1);
    const user = await ReadingStats
      .findByPk(1);
    const { articlesRead } = result.dataValues;
    const { articleId, userId } = user.dataValues;
    statsArticleId = articleId;
    statsUserId = userId;
    read = articlesRead;
  });
  it('should return 1 as readingStats', () => {
    read.should.be.equal(1);
    statsUserId.should.be.equal(1);
    statsArticleId.should.be.equal(2);
  });
});
