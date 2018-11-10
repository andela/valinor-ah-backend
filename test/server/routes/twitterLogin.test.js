import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';

import app from '../../../app';
import {
  profile,
  accessToken,
  tokenSecret
} from '../../../mockdata/twitterMockData';
import twitterCallback from '../../../server/helpers/twitterCallback';

chai.use(chaiHttp);

const should = chai.should();

describe('Test twitter login route', () => {
  before((done) => {
    nock('https://www.twitter.com/')
      .filteringPath(() => '/api/v1/auth/twitter')
      .get('/api/v1/auth/twitter')
      .reply(200);
    done();
  });

  // test twitter a route
  it('should authenticate with twitter', ((done) => {
    chai
      .request(app)
      .get('/api/v1/auth/twitter')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }));
});

describe('test twitter callback', () => {
  it('should return undefined if successful', (done) => {
    // eslint-disable-next-line max-len
    const twitterCallbackResult = twitterCallback(accessToken, tokenSecret, profile, done);
    should.equal(twitterCallbackResult, undefined);
  });
});
