import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';
import { createToken } from '../../../server/middlewares/tokenUtils';

chai.should();

chai.use(chaiHttp);
const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';

const updateData = {
  fullName: 'Tani Morgana',
  email: 't.morgan@gmail.com',
  bio: 'I am a girl that does magic tricks',
  avatarUrl: 'https://www.hahafakeurl.com/',
  location: 'England',
  facebookUrl: 'https://www.hahafakefacebookurl.com',
  twitterUrl: 'https://www.hahafaketwitterurl.com'
};

describe('Test default route', () => {
  it('Should return 200 for the default route', (done) => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Undefined Routes Should Return 404', (done) => {
    chai.request(app)
      .post('/another/undefined/route')
      .send({
        random: 'random',
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});

describe('/users/signup', () => {
  it('should create new user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Solomon Kingsley',
        email: 'solomon.sulaiman@andela.com',
        password: 'solomon123',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.user.token.should.be.a('string');
        res.body.user.fullName.should.be.a('string');
        res.body.user.email.should.be.a('string');
        res.body.user.fullName.should.be.eql('Solomon Kingsley');
        res.body.user.confirmEmail.should.be.eql(false);
        res.body.user.email.should.be.eql('solomon.sulaiman@andela.com');
        done();
      });
  });
  it('should create new user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Solomon Kingsley',
        password: 'solomon123',
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Testing Login feature -Integration testing', () => {
  it(
    'should display error message if user logs in with empty fields',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: '',
          password: ''
        })
        .end((err, res) => {
          res.status.should.be.eql(422);
          res.body.should.be.eql({
            errors: {
              email: ['please enter email'],
              password: ['please enter password']
            }
          });
          done();
        });
    }
  );

  it(
    'should display error message if user fails to enter password',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'augustineezinwa@gmail.com',
          password: ''
        })
        .end((err, res) => {
          res.status.should.be.eql(422);
          res.body.should.be.eql({
            errors: {
              password: ['please enter password']
            }
          });
          done();
        });
    }
  );

  it(
    'should display error message if user logs in with invalid credentials',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'augustineezinwa@gmail.com',
          password: 'fishdonek4'
        })
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.eql({
            errors: {
              message: ['Invalid email or password']
            }
          });
          done();
        });
    }
  );

  it(
    'should log in a user',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'solomon.sulaiman@andela.com',
          password: 'solomon123'
        })
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.status.should.be.eql('success');
          res.body.message.should.be.eql('you are logged in');
          res.body.user.email.should.be.eql('solomon.sulaiman@andela.com');
          res.body.user.token.should.be.a('string');
          done();
        });
    }
  );
});

describe('Verify user email via link', () => {
  let token;
  let token2;
  before(() => {
    token = createToken(1, '24h');
    token2 = createToken(9, '24h');
  });
  it(
    'should verify a user',
    (done) => {
      chai.request(app)
        .get(`/api/v1/users/verify?token=${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.deep.equal({
            status: 'success',
            message: 'user successfully verified'
          });
          done();
        });
    }
  );
  it(
    'should fail to verify an unregistered user',
    (done) => {
      chai.request(app)
        .get(`/api/v1/users/verify?token=${token2}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.deep.equal({
            errors: {
              message: ['user does not exist']
            }
          });
          done();
        });
    }
  );
  it(
    'should fail to verify an already verified user',
    (done) => {
      chai.request(app)
        .get(`/api/v1/users/verify?token=${token}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.deep.equal({
            errors: {
              message: ['user already verified']
            }
          });
          done();
        });
    }
  );
});

// USER PROFILE UPDATE TEST SUITE
describe('Update user profile', () => {
  const userData = {};
  before((done) => {
    // Sign up a user and get the id and token returned
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Not Tani',
        email: 'n.tani@whowa.com',
        password: 'ntanirfsee4',
      })
      .end((err, res) => {
        userData.id = res.body.user.id;
        userData.token = res.body.user.token;
        done();
      });
  });

  // try to update the user with no token
  describe('with no token provided', () => {
    const resData = {};
    before((done) => {
      chai.request(app)
        .patch(`/api/v1/users/${userData.id}`)
        .send(updateData)
        .end((err, res) => {
          resData.status = res.status;
          resData.body = res.body;
          done();
        });
    });

    // check return status and body
    it('should return status 401', () => {
      resData.status.should.equal(401);
    });
    it('should return a failure message', () => {
      resData.body.status.should.equal('failure');
      resData.body.errors.message.should.equal('no token provided');
    });
  });

  // update another user's account
  describe('with another user\'s account', () => {
    const resData = {};
    before((done) => {
      chai.request(app)
        .patch(`/api/v1/users/${userData.id + 5}`)
        .set('authorization', userData.token)
        .send(updateData)
        .end((err, res) => {
          resData.status = res.status;
          resData.body = res.body;
          done();
        });
    });

    // check return status and body
    it('should return status 403', () => {
      resData.status.should.equal(403);
    });
    it('should return a descriptive error message', () => {
      resData.body.status.should.equal('failure');
      resData.body.errors.message.should
        .equal('can\'t update another user\'s profile');
    });
  });

  // update the user with Valid data
  describe('with valid update data', () => {
    const resData = {};
    before((done) => {
      chai.request(app)
        .patch(`/api/v1/users/${userData.id}`)
        .set('authorization', userData.token)
        .send(updateData)
        .end((err, res) => {
          resData.status = res.status;
          resData.body = res.body;
          done();
        });
    });

    // check return status and body
    it('should return status 200', () => {
      resData.status.should.equal(200);
    });
    it('should update one user profile', () => {
      resData.body.status.should.equal('success');
      resData.body.message.should
        .equal('1 user profile updated successfully');
    });
  });

  describe('with non existent user profile column', () => {
    // clone object and add invalid user column
    const invalidUpdateData = Object.assign({}, updateData);
    invalidUpdateData.travis = 'this column doesn\'t exist';

    // fire updateProfile route with new invalid update data
    const resData = {};
    before((done) => {
      chai.request(app)
        .patch(`/api/v1/users/${userData.id}`)
        .set('authorization', userData.token)
        .send(invalidUpdateData)
        .end((err, res) => {
          resData.status = res.status;
          resData.body = res.body;
          done();
        });
    });

    // check return status and body
    it('should return status 422', () => {
      resData.status.should.equal(422);
    });
    it('return body containing a descriptive failure message', () => {
      resData.body.status.should.equal('failure');
      resData.body.errors.message.should
        .equal('user column \'travis\' does not exist');
    });
  });

  describe('with a user that does not exist', () => {
    // create fake token and try update
    const fakeId = 400;
    const fakeToken = createToken(fakeId, 10000);
    const resData = {};
    before((done) => {
      chai.request(app)
        .patch(`/api/v1/users/${fakeId}`)
        .set('authorization', fakeToken)
        .send(updateData)
        .end((err, res) => {
          resData.status = res.status;
          resData.body = res.body;
          done();
        });
    });

    // check return status and body
    it('should return status 404', () => {
      resData.status.should.equal(404);
    });
    it('return body containing a descriptive failure message', () => {
      resData.body.status.should.equal('failure');
      resData.body.errors.message.should
        .equal('user not found');
    });
  });
});
