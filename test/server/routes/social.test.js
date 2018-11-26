import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';

import facebookCallback from '../../../server/helpers/facebookCallback';
import twitterCallback from '../../../server/helpers/twitterCallback';
import googleCallback from '../../../server/helpers/googleCallback';
import app from '../../../app';
import {
  profile,
  accessToken,
  refreshToken
} from '../../../mockdata/facebookMockData';
import {
  profileInfo,
  access,
  tokenSecret
} from '../../../mockdata/twitterMockData';

chai.use(chaiHttp);

const should = chai.should();

describe('Test social login route', function social() {
  this.timeout(5000);
  before((done) => {
    nock('https://www.facebook.com/')
      .filteringPath(() => '/api/v1/auth/facebook')
      .get('/api/v1/auth/facebook')
      .reply(200, 'facebook login route called!');

    nock('https://accounts.google.com')
      .filteringPath(() => '/')
      .get('/')
      .reply(200, 'mock doodle log google');

    nock('https://twitter.com')
      .filteringPath(() => '/')
      .get('/')
      .reply(200);

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

  it('should authenticate with google', ((done) => {
    chai
      .request(app)
      .get('/api/v1/auth/google')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }));
  // test twitter a route
  it('should authenticate with twitter', ((done) => {
    chai
      .request(app)
      .get('/api/v1/auth/twitter')
      .end(() => {
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

describe('test twitter callback', () => {
  it('should return undefined if successful', (done) => {
    // eslint-disable-next-line max-len
    const twitterCallbackResult = twitterCallback(access, tokenSecret, profileInfo, done);
    should.equal(twitterCallbackResult, undefined);
  });
});

describe('Test google callback function', () => {
  it('should return undefined if successful', (done) => {
    profile.id = '976249283701273023';
    const result = googleCallback(accessToken, refreshToken, profile, done);
    should.equal(result, undefined);
  });
});
