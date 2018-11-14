import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../../../app';
import { ratingWithInvalidData } from '../../../mockdata/ratingMockData';

const articleId = 1;
const signupUrl = '/api/v1/users/signup';
const userData = {};

chai.use(chaiHttp);

describe('Articles Controller Tests', () => {
  describe('Add a rating', () => {
    before((done) => {
      chai.request(app)
        .post(signupUrl)
        .send({
          fullName: 'Freddie Krugger',
          email: 'freddie.kruggar@andela.com',
          password: 'freddie123',
        })
        .end((err, res) => {
          userData.id = res.body.user.id;
          userData.token = res.body.user.token;
          done();
        });
    });

    it('should not add rating if articleId is missing or invalid', (done) => {
      chai.request(app)
        .post(`/api/v1/articles/${articleId}ty/rating`)
        .set('Authorization', userData.token)
        .send({ rating: 5 })
        .end((err, res) => {
          res.body.should.be.a('object');
          res.status.should.be.eql(400);
          res.body.status.should.eql('failure');
          res.body.errors.message.should
            .eql('invalid id, article id must be a number');
        });
      done();
    });

    it('should not not save rating from unauithorized user', (done) => {
      chai.request(app)
        .post(`/api/v1/articles/${articleId}/rating`)
        .send({ rating: ratingWithInvalidData.rating })
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.a('object');
          res.body.status.should.eql('unauthorized');
          done();
        });
    });

    it('should add a new rating', (done) => {
      chai.request(app)
        .post(`/api/v1/articles/${articleId}/rating`)
        .set('Authorization', userData.token)
        .send({ rating: ratingWithInvalidData.rating })
        .end((err, res) => {
          res.body.should.be.a('object');
          res.status.should.be.eql(201);
          res.body.status.should.eql('success');
          done();
        });
    });

    it('should update a rating', (done) => {
      chai.request(app)
        .post(`/api/v1/articles/${articleId}/rating`)
        .set('Authorization', userData.token)
        .send({ rating: 5 })
        .end((err, res) => {
          res.body.should.be.a('object');
          res.status.should.be.eql(200);
          res.body.status.should.eql('success');
          res.body.message.should.eql('rating updated sucessfully');
        });
      done();
    });
  });
});
