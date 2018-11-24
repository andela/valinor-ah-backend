import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';

const should = chai.should();

chai.use(chaiHttp);

describe('should test server homepage', () => {
  it('should return the homepage', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        should.equal(res.status, 200);
        should.equal(
          res.body.message,
          'Welcome to Author\'s Haven Homepage, the community of great authors'
        );
        done();
      });
  });
});

describe('should test server login page', () => {
  it('should return the login page', (done) => {
    chai.request(app)
      .get('/login')
      .end((err, res) => {
        should.equal(res.status, 200);
        should.equal(
          res.body.message,
          'Authors\'s Haven login page'
        );
        done();
      });
  });
});
