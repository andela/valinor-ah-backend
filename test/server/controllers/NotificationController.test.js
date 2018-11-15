import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';
import { createToken } from '../../../server/middlewares/tokenUtils';

chai.should();

chai.use(chaiHttp);

const updateNotificationUrl = '/api/v1/users';
const confirmUserEmailUrl = '/api/v1/users/verify?token=';

const userData = {};
userData.token = createToken(2, '5m');

describe('Test Notification Controller', () => {
  it('Should throw unauthorized error', (done) => {
    chai.request(app)
      .put(updateNotificationUrl)
      .send({
        notification: false,
      })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.an('object');
        res.body.status.should.be.eql('unauthorized');
        res.body.message.should.be.a.eql('please provide a token');
        done();
      });
  });
  it('should not opt out of notification', (done) => {
    chai.request(app)
      .put(updateNotificationUrl)
      .set('Authorization', userData.token)
      .send({
        notification: false
      })
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.errors.message.should.be.eql(
          'please confirm your email then try again'
        );
        done();
      });
  });
  it('should verify the email of the user', (done) => {
    chai.request(app)
      .get(`${confirmUserEmailUrl}${userData}`)
      .set('Authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.message.should.be.eql('Email confirmed successfully');
        done();
      });
  });
  it('should opt out of notification', (done) => {
    chai.request(app)
      .put(updateNotificationUrl)
      .set('Authorization', userData.token)
      .send({
        notification: false
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.message.should.be.eql('You have successfully opt-out');
        done();
      });
  });
  it('should opt in of notification', (done) => {
    chai.request(app)
      .put(updateNotificationUrl)
      .set('Authorization', userData.token)
      .send({
        notification: true
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.message.should.be.deep.equal('You have successfully opt-in');
        done();
      });
  });
});
