import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';
import {
  articleInputValid,
  articleInputNoTitle,
} from '../../../mockdata/articleMockData';

const should = chai.should();

chai.use(chaiHttp);


const getAnArticleUrl = string => `/api/v1/articles/${string}`;

describe('Articles Controller Tests', () => {
  const userData = {};
  before((done) => {
    // Sign up a user and get the id and token returned
    chai.request(app)
      .post('/api/v1/users/signup')
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

  describe('Create an article with valid inputs', () => {
    const result = {};
    before((done) => {
      // create an article
      chai.request(app)
        .post('/api/v1/articles')
        .send(articleInputValid)
        .set('Authorization', userData.token)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });

    // check status code
    it('should return a status of 201', () => {
      result.status.should.equal(201);
    });

    // check body
    it('should return the expected body', () => {
      result.body.status.should.equal('success');
      result.body.article.title.should.equal(articleInputValid.title);
    });
  });

  describe('Create an article with no title', () => {
    const result = {};
    before((done) => {
      // create an article
      chai.request(app)
        .post('/api/v1/articles')
        .send(articleInputNoTitle)
        .set('Authorization', userData.token)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });

    // check status code
    it('should return a status of 422', () => {
      result.status.should.equal(422);
    });

    // check body
    it('should return the expected body', () => {
      result.body.errors.title[0].should.equal('please enter a title');
    });
  });

  describe('Create an article with no token', () => {
    const result = {};
    before((done) => {
      // create an article with no token
      chai.request(app)
        .post('/api/v1/articles')
        .send(articleInputValid)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });

    // check status code
    it('should return a status of 401', () => {
      result.status.should.equal(401);
    });

    // check body
    it('should return the expected body', () => {
      result.body.status.should.equal('unauthorized');
      result.body.message.should.equal('please provide a token');
    });
  });

  describe('Create an article with an invalid token', () => {
    const result = {};
    before((done) => {
      // create an article with invalid token
      chai.request(app)
        .post('/api/v1/articles')
        .set('Authorization', 'doashjidjasojdaoijadp')
        .send(articleInputValid)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });

    // check status code
    it('should return a status of 401', () => {
      result.status.should.equal(401);
    });

    // check body
    it('should return the expected body', () => {
      result.body.status.should.equal('unauthorized');
      result.body.message.should.equal('invalid token!');
    });
  });

  describe('Testing get an article', () => {
    it('Should return error if article doesnt exist', (done) => {
      chai.request(app).get(getAnArticleUrl(90))
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.eql({
            status: 'failure',
            errors: {
              message: ['Article not found']
            }
          });
          done();
        });
    });
    // eslint-disable-next-line max-len
    it('Should return error if fetching non existent article by slug', (done) => {
      chai.request(app).get(getAnArticleUrl('my-donkey-is-at-the-beach-3423'))
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.should.be.eql({
            status: 'failure',
            errors: {
              message: ['Article not found']
            }
          });
          done();
        });
    });
    it('Should return an article by slug', (done) => {
      chai.request(app).get(getAnArticleUrl('south-africa-201'))
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.article.id.should.be.eql(2);
          res.body.article.title.should.be.eql('Jambolani');
          res.body.article.slug.should.be.eql('south-africa-201');
          res.body.article.userId.should.be.eql(2);
          res.body.article.description.should.be
            .eql('Jambolani is the fifa ball');
          res.body.article.author.email.should.be
            .eql('johnmike@andela.com');
          res.body.article.author.fullName.should.be
            .eql('John Mike');
          res.body.article.author.roleId.should.be.eql(3);
          should.equal(res.body.article.author.avatarUrl, null);
          should.equal(res.body.article.author.bio, null);
          done();
        });
    });
    it('Should return an article by id', (done) => {
      chai.request(app).get(getAnArticleUrl(2))
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.article.id.should.be.eql(2);
          res.body.article.title.should.be.eql('Jambolani');
          res.body.article.slug.should.be.eql('south-africa-201');
          res.body.article.userId.should.be.eql(2);
          res.body.article.description.should.be
            .eql('Jambolani is the fifa ball');
          res.body.article.author.email.should.be
            .eql('johnmike@andela.com');
          res.body.article.author.fullName.should.be
            .eql('John Mike');
          res.body.article.author.roleId.should.be.eql(3);
          should.equal(res.body.article.author.avatarUrl, null);
          should.equal(res.body.article.author.bio, null);
          done();
        });
    });
  });
});
describe('Fetch all articles', () => {
  it('test /api/v1/articles route', (done) => {
    chai.request(app)
      .get('/api/v1/articles')
      .end((err, res) => {
        should.equal(res.body.articles[1].title, 'Valinor');
        should.equal(res.body.articles[1]
          .slug, 'team-valinor');
        should.equal(res.body.articles[1]
          .description, 'Team valinor is a simulation team');
        should.equal(res.body.articles[1].author.fullName, 'John Mike');
        should.equal(res.body.articles[1].author.avatarUrl, null);
        should.equal(res.status, 200);
        done();
      });
  });
});
