import chai from 'chai';
import chaiHttp from 'chai-http';
import index from '../../../index';

chai.use(chaiHttp);

const user = {
  email: 'test.email@example.com',
  username: 'vivavalinor',
};

describe('Send verification email with valid user', () => {
  const data = {};
  before((done) => {
    chai.request(index)
      .post('/api/users/sendVerification')
      .send(user)
      .end((err, res) => {
        data.status = res.status;
        data.body = res.body;
        done();
      });
  });

  it('should return status 200', () => {
    data.status.should.equal(200);
  });

  it('should have body containing success message', () => {
    data.body.status.should.equal('success');
    data.body.message.should.equal('mail sent');
  });

  describe('Verify user with token', () => {
    it('should be successful', (done) => {
      chai.request(index)
        .get('/api/users/verify')
        .query({ token: data.body.verificationToken })
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.status.should.equal('success');
          res.body.message.should
            .equal(`user email ${user.email} successufully verified`);
          done();
        });
    });
  });
});


describe('Verify user with no token', () => {
  const data = {};
  before((done) => {
    chai.request(index)
      .get('/api/users/verify')
      .end((err, res) => {
        data.status = res.status;
        data.body = res.body;
        done();
      });
  });
  it('should return status 403', () => {
    data.status.should.equal(403);
  });

  it('should have body containing unauthorized message', () => {
    data.body.status.should.equal('unauthorized');
    data.body.message.should.equal('no token provided');
  });
});
