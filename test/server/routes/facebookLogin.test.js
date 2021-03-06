import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';

// eslint-disable-next-line max-len
import { profile, accessToken, refreshToken } from '../../../mockdata/facebookMockData';
import facebookCallback from '../../../server/helpers/facebookCallback';
import app from '../../../app';

chai.use(chaiHttp);

const should = chai.should();

describe('Test facebook login route', () => {
  before((done) => {
    nock('https://www.facebook.com/')
      .filteringPath(() => '/api/v1/auth/facebook')
      .get('/api/v1/auth/facebook')
      .reply(200, 'facebook login route called!');
    done();
  });

  // test facebook a route
  it('should authenticate with facebook', ((done) => {
    chai
      .request(app)
      .get('/api/v1/auth/facebook')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.equal('facebook login route called!');
        done();
      });
  }));
});

describe('Test facebook callback function', () => {
  it('should return undefined if successful', (done) => {
    // eslint-disable-next-line max-len
    const facebookCallbackResult = facebookCallback(accessToken, refreshToken, profile, done);
    should.equal(facebookCallbackResult, undefined);
  });
});
