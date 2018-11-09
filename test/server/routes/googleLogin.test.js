import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';

import app from '../../../app';
import {
  profile,
  accessToken,
  refreshToken
} from '../../../mockdata/facebookMockData';
import googleCallback from '../../../server/helpers/googleCallback';

chai.use(chaiHttp);

const should = chai.should();

describe('Test Google login route', function google() {
  this.timeout(4000);
  before(() => {
    nock('https://www.google.com/')
      .filteringPath(() => '/api/v1/auth/google')
      .get('/api/v1/auth/google')
      .reply(200, 'mock doodle log google');
  });

  // test google route
  it('should authenticate with google', ((done) => {
    chai
      .request(app)
      .get('/api/v1/auth/google')
      .end((err, res) => {
        res.should.have.status(200);
        // res.text.should.be.equal('mock doodle log google');
        done();
      });
  }));
});

describe('Test google callback function', () => {
  let result;
  before((done) => {
    result = googleCallback(accessToken, refreshToken, profile, done);
    done();
  });

  it('should return undefined if successful', () => {
    should.equal(result, undefined);
  });
});
