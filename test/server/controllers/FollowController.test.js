import chai from 'chai';
import app from '../../../app';
import { userData } from '../../../mockdata/userMockData';

const should = chai.should();

describe('FollowController Tests', () => {
  before((done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send({
        fullName: 'Fishes Donkey',
        email: 'fishdonkey@jackson.com',
        password: 'ntanirfsee4',
      })
      .end((err, res) => {
        userData.id = res.body.user.id;
        userData.token = res.body.user.token;
        done();
      });
  });
  it('should throw error trying to follow a non-existent user', (done) => {
    chai.request(app).post('/api/v1/users/follow/10000')
      .set('Authorization', userData.token)
      .end((err, res) => {
        res.status.should.be.eql(404);
        res.body.should.be.eql({
          status: 'failure',
          errors: {
            message: ['user not found']
          }
        });
        done();
      });
  });
  it('should throw error trying to follow yourself', (done) => {
    chai.request(app).post(`/api/v1/users/follow/${userData.id}`)
      .set('Authorization', userData.token)
      .end((err, res) => {
        res.status.should.be.eql(403);
        res.body.should.be.eql({
          status: 'failure',
          errors: {
            message: ['you cant follow yourself']
          }
        });
        done();
      });
  });
  it(`should throw error trying to follow a user that has not
     published up to 5 articles`, (done) => {
    chai.request(app).post('/api/v1/users/follow/3')
      .set('Authorization', userData.token)
      .end((err, res) => {
        res.status.should.be.eql(403);
        res.body.should.be.eql({
          status: 'failure',
          errors: {
            message: [
              'you cant follow a user with less than 5 published articles'
            ]
          }
        });
        done();
      });
  });
  it(`should successfully follow an author with more than
    five published articles`, (done) => {
    chai.request(app).post('/api/v1/users/follow/2')
      .set('Authorization', userData.token)
      .end((err, res) => {
        res.status.should.be.eql(200);
        res.body.should.be.eql({
          status: 'success',
          message: 'you followed this author',
          followStatus: true
        });
        done();
      });
  });
  it(`should show views for all 
    followers and following for a particular user`, (done) => {
    chai.request(app).get('/api/v1/users/follow/2')
      .end((err, res) => {
        res.status.should.be.eql(200);
        res.body.status.should.be.eql('success');
        res.body.following.length.should.be.eql(0);
        res.body.followers[0].fullName.should.be.eql('Fishes Donkey');
        should.equal(res.body.followers[0].avatarUrl, null);
        done();
      });
  });
  it(`should successfully unfollow an author with more than
    five published articles`, (done) => {
    chai.request(app).post('/api/v1/users/follow/2')
      .set('Authorization', userData.token)
      .end((err, res) => {
        res.status.should.be.eql(200);
        res.body.should.be.eql({
          status: 'success',
          message: 'you unfollowed this author',
          followStatus: false
        });
        done();
      });
  });
});
