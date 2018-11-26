import chaiHttp from 'chai-http';
import chai from 'chai';

import models from '../../../server/models';
import app from '../../../app';
import { createToken } from '../../../server/middlewares/tokenUtils';

const should = chai.should();
const { User } = models;
chai.use(chaiHttp);
const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';

const updateData = {
  fullName: 'Tani Morgana',
  email: 'solomon.sulaiman@andela.com',
  bio: 'I am a girl that does magic tricks',
  avatarUrl: 'https://www.hahafakeurl.com/',
  location: 'England',
  facebookUrl: 'https://www.hahafakefacebookurl.com',
  twitterUrl: 'https://www.hahafaketwitterurl.com'
};

const userData = {};

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
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        userData.id = 6;
        userData.token = createToken(6, '1h');
        done();
      });
  });

  it('should not create new user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Solomon Kingsley'
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        done();
      });
  });
});

describe('Testing Login feature -Integration testing', () => {
  describe('POST /api/v1/users/login', () => {
    it('should display error message if email field is empty', (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: ''
        })
        .end((err, res) => {
          res.status.should.be.eql(422);
          res.body.should.be.eql({
            errors: {
              email: ['please enter a valid email']
            }
          });
          done();
        });
    });

    it('should send login email to a user', (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'solomon.sulaiman@andela.com'
        })
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.status.should.be.eql('success');
          res.body.message.should.be
            .eql('email login link sent successfully');
          res.body.token.should.be.a('string');
          done();
        });
    });
  });

  describe('GET /api/v1/users/login', () => {
    let confirmedUserToken;
    let unregisteredUserToken;
    let unconfirmedUserToken;
    before(() => {
      confirmedUserToken = createToken(4, '1h');
      unconfirmedUserToken = createToken(1, '1h');
      unregisteredUserToken = createToken(100, '1h');
    });

    it('should show error if token is invalid', (done) => {
      chai.request(app)
        .get(`${loginUrl}?token=${confirmedUserToken}1s`)
        .end((err, res) => {
          res.status.should.eql(401);
          res.body.status.should.eql('unauthorized');
          res.body.message.should.eql('invalid token!');
        });
      done();
    });

    it('should show error if token is missing', (done) => {
      chai.request(app)
        .get(`${loginUrl}?token=`)
        .end((err, res) => {
          res.status.should.eql(401);
          res.body.status.should.eql('unauthorized');
          res.body.message.should.eql('please provide a token');
        });
      done();
    });

    it('should show error if user is not found', (done) => {
      chai.request(app)
        .get(`${loginUrl}?token=${unregisteredUserToken}`)
        .end((err, res) => {
          res.status.should.eql(401);
          res.body.errors.message.should.eql('Please sign up');
          done();
        });
    });

    it('should not log in a user in if email is not confirmed', (done) => {
      chai.request(app)
        .get(`${loginUrl}?token=${unconfirmedUserToken}`)
        .end((err, res) => {
          res.status.should.eql(409);
          res.body.status.should.eql('failure');
          done();
        });
    });

    it('should log a user in if email is confirmed', (done) => {
      chai.request(app)
        .get(`${loginUrl}?token=${confirmedUserToken}`)
        .end((err, res) => {
          res.status.should.eql(200);
          res.body.status.should.eql('success');
          res.body.message.should.eql('you are logged in');
          done();
        });
    });
  });
});

describe('Verify user email via link', () => {
  let token;
  let token2;
  before(() => {
    token = createToken(1, '24h');
    token2 = createToken(90, '24h');
  });
  it(
    'should verify a user',
    (done) => {
      chai.request(app)
        .get(`/api/v1/users/verify?token=${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.deep.equal('success');
          res.body.message.should.deep.equal('Email confirmed successfully');
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
          res.should.have.status(401);
          res.body.should.deep.equal({
            errors: {
              message: 'Please sign up'
            },
            status: 'failure'
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

// GET USERS PROFILES TEST SUTE
describe('Get all user Profiles', () => {
  const token = createToken(5, '1h');
  describe('with an unconfirmed email', () => {
    const result = {};
    before((done) => {
      chai.request(app)
        .get('/api/v1/users')
        .set('authorization', token)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });

    it('should have a status of 403', () => {
      result.status.should.equal(403);
    });
    it('should have a descriptive error message', () => {
      result.body.errors.message.should
        .equal('please confirm your email then try again');
    });
  });

  describe('with confirmed email', () => {
    const result = {};
    before((done) => {
      // confirm the user's email
      chai.request(app)
        .get(`/api/v1/users/verify?token=${userData.token}`)
        .end(() => {
          done();
        });
    });

    before((done) => {
      chai.request(app)
        .get('/api/v1/users')
        .set('authorization', userData.token)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });

    it('should have a response of 200', () => {
      result.status.should.equal(200);
    });
    it('should have a body containing an array of profiles', () => {
      result.body.Users.should.be.an('Array');
    });
  });
});

// USER PROFILE UPDATE TEST SUITE
describe('Update user profile', () => {
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
      resData.body.status.should.equal('unauthorized');
      resData.body.message.should.equal('please provide a token');
    });
  });

  // update another user's account
  describe('with another user\'s account', () => {
    const resData = {};
    before((done) => {
      chai.request(app)
        .patch(`/api/v1/users/${userData.id - 1}`)
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
      resData.status.should.equal(401);
    });
    it('return body containing a descriptive failure message', () => {
      resData.body.status.should.equal('failure');
      resData.body.errors.message.should
        .equal('Please sign up');
    });
  });
});

// GET A USER PROFILE
describe('Get user profile', () => {
  describe('for my own profile', () => {
    const result = {};
    before((done) => {
      // get my profile
      chai.request(app)
        .get(`/api/v1/users/${userData.id}`)
        .set('authorization', userData.token)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });
    it('should have a status of 200', () => {
      result.status.should.be.equal(200);
    });
    it('should have a response containing all the users attributes', () => {
      result.body.status.should.be.equal('success');
      result.body.userProfile.id.should.be.equal(userData.id);
      result.body.userProfile.bio.should.be.equal(updateData.bio);
    });
  });

  describe('for another user\'s profile', () => {
    const result = {};
    before((done) => {
      // get my profile
      chai.request(app)
        .get(`/api/v1/users/${userData.id - 1}`)
        .set('authorization', userData.token)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });
    it('should have a status of 200', () => {
      result.status.should.be.equal(200);
    });
    it('should have a response body with only public attributes', () => {
      result.body.status.should.be.equal('success');
      should.equal(result.body.userProfile.email, undefined);
      should.equal(result.body.userProfile.googleId, undefined);
      should.equal(result.body.userProfile.facebookId, undefined);
      should.equal(result.body.userProfile.twitterId, undefined);
    });
  });
});

describe('Test fetch all authors route', () => {
  describe('Test fetch all authors route without authors', async () => {
    it('should return no authors from the database', () => {
      chai
        .request(app)
        .get('/api/v1/users/authors')
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.errors.message.should.be
            .eql('we currently have no authors on Author\'s Haven');
        });
    });
  });

  describe('Test fetch all authors route with one author', () => {
    before(async () => {
      await User.update({
        roleId: 2
      }, {
        where: {
          id: 1
        }
      });
    });
    it('should return one author from the database', () => {
      chai
        .request(app)
        .get('/api/v1/users/authors')
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.authors[0].id.should.equal(1);
          res.body.authors[0].fullName.should.equal('John Doe');
        });
    });
  });
});

describe('Testing automatic upgrade role functionality', () => {
  const data = { token: createToken(4) };
  it('user should create first article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Authorization', data.token)
      .send({
        title: 'My story at the beach',
        description: 'How I ventured in the beach',
        body: 'This is the body of my story',
        categoryId: 1,
      })
      .end((err, res) => {
        res.status.should.be.eql(201);
        res.body.article.author.roleId.should.be.eql(3);
        done();
      });
  });
  it('user should create second article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Authorization', data.token)
      .send({
        title: 'My story at the beach',
        description: 'How I ventured in the beach',
        body: 'This is the body of my story',
        categoryId: 1,
      })
      .end((err, res) => {
        res.status.should.be.eql(201);
        res.body.article.author.roleId.should.be.eql(3);
        done();
      });
  });
  it('user should create third article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Authorization', data.token)
      .send({
        title: 'My story at the beach',
        description: 'How I ventured in the beach',
        body: 'This is the body of my story',
        categoryId: 1,
      })
      .end((err, res) => {
        res.status.should.be.eql(201);
        res.body.article.author.roleId.should.be.eql(3);
        done();
      });
  });
  it('user should create fourth article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Authorization', data.token)
      .send({
        title: 'My story at the beach',
        description: 'How I ventured in the beach',
        body: 'This is the body of my story',
        categoryId: 1,
      })
      .end((err, res) => {
        res.status.should.be.eql(201);
        res.body.article.author.roleId.should.be.eql(3);
        done();
      });
  });
  it('user should create fifth article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('Authorization', data.token)
      .send({
        title: 'My story at the beach',
        description: 'How I ventured in the beach',
        body: 'This is the body of my story',
        categoryId: 1,
      })
      .end((err, res) => {
        res.status.should.be.eql(201);
        res.body.article.author.roleId.should.be.eql(2);
        done();
      });
  });
});
