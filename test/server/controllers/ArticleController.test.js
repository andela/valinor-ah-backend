import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';
import {
  articleInputValid,
  articleInputNoTitle,
} from '../../../mockdata/articleMockData';

const should = chai.should();

chai.use(chaiHttp);

const articleBaseUrl = '/api/v1/articles';
const getAnArticleUrl = string => `${articleBaseUrl}/${string}`;

describe('Articles Controller Tests', () => {
  const userData = {};

  // FETCH ALL ARTICLES
  describe('Fetch all articles', () => {
    it('test /api/v1/articles route', (done) => {
      chai.request(app)
        .get('/api/v1/articles')
        .end((err, res) => {
          should.equal(res.body.articles[0].title, 'Valinor');
          should.equal(res.body.articles[0]
            .slug, 'team-valinor');
          should.equal(res.body.articles[0]
            .description, 'Team valinor is a simulation team');
          should.equal(res.body.articles[0].author.fullName, 'John Mike');
          should.equal(res.body.articles[0].author.avatarUrl, null);
          should.equal(res.status, 200);
          done();
        });
    });
    it(
      'should return error if page number & limit are not integers',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles?page=a&limit=u')
          .end((err, res) => {
            res.body.should.deep.equal({
              errors: {
                page: [
                  'page query must be an integer',
                  'page query must be greater than 0'
                ],
                limit: [
                  'limit query must be an integer',
                  'limit query must be greater than 0'
                ]
              }
            });
            should.equal(res.status, 400);
            done();
          });
      }
    );
    it('should return error if page number & limit are less than 1', (done) => {
      chai.request(app)
        .get('/api/v1/articles?page=0&limit=0')
        .end((err, res) => {
          res.body.should.deep.equal({
            errors: {
              page: [
                'page query must be greater than 0'
              ],
              limit: [
                'limit query must be greater than 0'
              ]
            }
          });
          should.equal(res.status, 400);
          done();
        });
    });
    it('should return error if maximum pages are reached', (done) => {
      chai.request(app)
        .get('/api/v1/articles?page=9&limit=10')
        .end((err, res) => {
          should.equal(
            res.body.errors.status,
            'failure'
          );
          should.equal(
            res.body.errors.message,
            'available number of page(s) exceeded'
          );
          should.equal(res.status, 422);
          done();
        });
    });
    it(
      'should return error if page & limit queries are not provided',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles')
          .end((err, res) => {
            should.equal(res.body.articles[0].title, 'Valinor');
            should.equal(res.body.articles[0]
              .slug, 'team-valinor');
            should.equal(res.body.articles[0]
              .description, 'Team valinor is a simulation team');
            should.equal(res.body.articles[0].author.fullName, 'John Mike');
            should.equal(res.body.articles[0].author.avatarUrl, null);
            should.equal(res.status, 200);
            done();
          });
      }
    );
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

  describe('Create an Article', () => {
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
  });

  // LIKE OR DISLIKE AN ARTICLE
  describe('like/dislike an article', () => {
    const result = {};
    const articleId = '3';
    // like an article
    describe('like an article', () => {
      before((done) => {
        // like an article
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/like`)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should return a status of 201', () => {
        result.status.should.be.equal(201);
      });
      it('should return a success message', () => {
        result.body.status.should.be.equal('success');
        result.body.message.should.be.equal('article successfully liked');
      });
    });

    describe('undo like of an article', () => {
      before((done) => {
        // like the same article(should undo)
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/like`)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should return a status of 200', () => {
        result.status.should.be.equal(200);
      });
      it('should return a success message', () => {
        result.body.status.should.be.equal('success');
        result.body.message.should.be.equal('article like, undo successful');
      });
    });

    describe('dislike an article', () => {
      before((done) => {
        // dislike an article
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/dislike`)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should return a status of 201', () => {
        result.status.should.be.equal(201);
      });
      it('should return a success message', () => {
        result.body.status.should.be.equal('success');
        result.body.message.should.be.equal('article successfully disliked');
      });
    });

    describe('undo dislike of an article', () => {
      before((done) => {
        // dislike the same article(should undo)
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/dislike`)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should return a status of 200', () => {
        result.status.should.be.equal(200);
      });
      it('should return a success message', () => {
        result.body.status.should.be.equal('success');
        result.body.message.should.be.equal('article dislike, undo successful');
      });
    });

    describe('like then dislike of an article', () => {
      before((done) => {
        // like an article
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/like`)
          .set('Authorization', userData.token)
          .end(() => {
            done();
          });
      });

      before((done) => {
        // dislike the same article
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/dislike`)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should return a status of 200', () => {
        result.status.should.be.equal(200);
      });
      it('should return a success message', () => {
        result.body.status.should.be.equal('success');
        // eslint-disable-next-line max-len
        result.body.message.should.be.equal('you changed your mind, article successfully disliked');
      });
    });

    describe('like an article that of id that is not a number', () => {
      before((done) => {
        // like an article with a fake slug
        chai.request(app)
          .post(`${articleBaseUrl}/homerton-b-baleclava-1n2n1t/like`)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should return a status of 400', () => {
        result.status.should.be.equal(400);
      });
      it('should return a not found message', () => {
        result.body.status.should.be.equal('failure');
        // eslint-disable-next-line max-len
        result.body.errors.message.should.be.equal('invalid id, article id must be a number');
      });
    });

    describe('like an article that does not exist', () => {
      before((done) => {
        // like an article with a fake slug
        chai.request(app)
          .post(`${articleBaseUrl}/100000/like`)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should return a status of 404', () => {
        result.status.should.be.equal(404);
      });
      it('should return a not found message', () => {
        result.body.status.should.be.equal('failure');
        // eslint-disable-next-line max-len
        result.body.errors.message.should.be.equal('Sorry, that article was not found');
      });
    });
  });
});
