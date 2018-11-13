import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';


chai.should();

chai.use(chaiHttp);
const signupUrl = '/api/v1/users/signup';

const userData = {};

describe('Testing comment on articles', () => {
  it('should create new user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Solomon Kingsley',
        email: 'abiodun.abud@andela.com',
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
        res.body.user.email.should.be.eql('abiodun.abud@andela.com');
        userData.id = res.body.user.id;
        userData.token = res.body.user.token;
        done();
      });
  });
  it('POST /article/:articleId/comments add new comment', () => {
    chai.request(app)
      .post('/api/v1/articles/1/comments')
      .set('authorization', userData.token)
      .send({
        body: 'Working as expected'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.comment.should.be.a('object');
        res.body.comment.body.should.be.a('string');
        res.body.comment.commentBy.should.be.a('object');
      });
  });
  it('POST /article/:articleId/comments should not add new comment', () => {
    chai.request(app)
      .post('/api/v1/articles/1/comments')
      .set('authorization', userData.token)
      .send({
        commentBody: 'Working as expected'
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.errors.should.be.a('object');
      });
  });
});
