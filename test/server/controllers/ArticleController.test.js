import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../../../app';
import { createToken } from '../../../server/middlewares/tokenUtils';

import {
  articleInputValid,
  articleUpdateValid,
  articleUpdateInvalidStatus,
  articleUpdateInvalidTags,
  articleInputNoTitle,
  articleInputInvalidTags,
  articleReportData,
  articleReportDataNoReportBody,
  articleReportDataNoType,
  articleReportDataBadType
} from '../../../mockdata/articleMockData';

const should = chai.should();

chai.use(chaiHttp);

const articleBaseUrl = '/api/v1/articles';
const getAnArticleUrl = string => `${articleBaseUrl}/${string}`;

describe('Articles Controller Tests', () => {
  const userData = {};
  let articleData = {};

  // FETCH ALL CATEGORIES
  describe('Fetch all categories', () => {
    const result = {};
    before((done) => {
      chai.request(app)
        .get(`${articleBaseUrl}/categories`)
        .end((err, res) => {
          result.status = res.status;
          result.body = res.body;
          done();
        });
    });

    it('should have a status of 200', () => {
      result.status.should.be.equal(200);
    });

    it('should contain all categories', () => {
      result.body.categories.should.be.an('Array');
      result.body.categories[0].categoryName.should.be.equal('fashion');
      result.body.categories[1].categoryName.should.be.equal('sports');
      result.body.categories[2].categoryName.should.be.equal('technology');
    });
  });

  // FETCH ALL ARTICLES
  describe('Fetch all articles', () => {
    it('test /api/v1/articles/category/all route', (done) => {
      chai.request(app)
        .get('/api/v1/articles/category/all')
        .end((err, res) => {
          should.equal(res.body.articles[0].title, 'Valinor');
          should.equal(res.body.articles[0]
            .slug, 'team-valinore');
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
          .get('/api/v1/articles/category/all?page=a&limit=u')
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
        .get('/api/v1/articles/category/all?page=0&limit=0')
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
        .get('/api/v1/articles/category/all?page=9&limit=10')
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
          .get('/api/v1/articles/category/fashion')
          .end((err, res) => {
            should.equal(res.body.articles[0].title, 'Valinor');
            should.equal(res.body.articles[0]
              .slug, 'team-valinord');
            should.equal(res.body.articles[0]
              .description, 'Team valinor is a simulation team');
            should.equal(res.body.articles[0].author.fullName, 'John Mike');
            should.equal(res.body.articles[0].author.avatarUrl, null);
            should.equal(res.status, 200);
            done();
          });
      }
    );
    it(
      'should return error if category does not exist',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/kljdnf')
          .end((err, res) => {
            res.body.should.deep.equal({
              status: 'failure',
              errors: {
                message: 'this category does not exist'
              }
            });
            should.equal(res.status, 404);
            done();
          });
      }
    );
    it(
      'should return articles with author query',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/all?author=1')
          .end((err, res) => {
            should.equal(res.body.articles[0].title, 'My story at the beach');
            should.equal(res.status, 200);
            done();
          });
      }
    );
    it(
      'should return articles with tag query',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/all?tag=1 2')
          .end((err, res) => {
            should.equal(res.body.articles[0].title, 'Jambolani');
            should.equal(res.status, 200);
            done();
          });
      }
    );
    it(
      'should return articles with tag query',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/all?tag=12')
          .end((err, res) => {
            res.body.should.deep.equal({
              status: 'failure',
              errors: {
                message: 'this tag does not match any existing article'
              }
            });
            should.equal(res.status, 404);
            done();
          });
      }
    );
    it(
      'should return search results',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/all?search=valinor')
          .end((err, res) => {
            should.equal(res.body.articles[0].title, 'Valinor');
            should.equal(res.status, 200);
            done();
          });
      }
    );
    it(
      'should return search results',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/fashion?author=3')
          .end((err, res) => {
            res.body.should.deep.equal({
              errors: {
                status: 'failure',
                message: 'no articles found'
              }
            });
            should.equal(res.status, 404);
            done();
          });
      }
    );
    it(
      'should error if author query is not an integer',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/fashion?author=e')
          .end((err, res) => {
            res.body.should.deep.equal({
              errors: {
                author: [
                  'author query must be an integer'
                ]
              }
            });
            should.equal(res.status, 400);
            done();
          });
      }
    );
    it(
      'should error if tag query is not an integer',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/fashion?author=1&tag=s')
          .end((err, res) => {
            res.body.should.deep.equal({
              errors: {
                tag: [
                  'tag query must be an integer'
                ]
              }
            });
            should.equal(res.status, 400);
            done();
          });
      }
    );
    it(
      'should error if category parameter is not an integer',
      (done) => {
        chai.request(app)
          .get('/api/v1/articles/category/83493')
          .end((err, res) => {
            res.body.should.deep.equal({
              errors: {
                categoryName: [
                  'category parameter can only contain alphabets'
                ]
              }
            });
            should.equal(res.status, 400);
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
      chai.request(app)
        .get(getAnArticleUrl('south-africa-201'))
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.article.id.should.be.eql(2);
          res.body.article.title.should.be.eql('Jambolani');
          res.body.article.slug.should.be.eql('south-africa-201');
          res.body.article.description.should.be
            .eql('Jambolani is the fifa ball');
          res.body.article.author.fullName.should.be
            .eql('John Mike');
          should.equal(res.body.article.author.avatarUrl, null);
          done();
        });
    });
    it('Should return an article by id', (done) => {
      const token = createToken(1, '24h');
      chai.request(app).get(getAnArticleUrl(2))
        .set('authorization', token)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.article.id.should.be.eql(2);
          res.body.article.title.should.be.eql('Jambolani');
          res.body.article.slug.should.be.eql('south-africa-201');
          res.body.article.author.fullName.should.be
            .eql('John Mike');
          should.equal(res.body.article.author.avatarUrl, null);
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
        })
        .end(() => {
          userData.id = 5;
          userData.token = createToken(5, '1h');
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
            articleData = res.body.article;
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
        result.body.article.author.fullName.should.be.eql('Not Tani');
        result.body.article.author.email.should.be.eql('n.tani@whowa.com');
      });
    });

    describe('Create and article with invalid Tags', () => {
      const result = {};
      before((done) => {
        // create an article with an invalid tag
        chai.request(app)
          .post('/api/v1/articles')
          .send(articleInputInvalidTags)
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
      it('should return a descriptive failure message', () => {
        result.body.errors.tags[0].should
          .equal('tags must be an array of non-empty strings');
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

  // Edit an article
  describe('edit the article', () => {
    const result = {};
    describe('with valid data', () => {
      before((done) => {
        chai.request(app)
          .patch(`/api/v1/articles/${articleData.id}`)
          .send(articleUpdateValid)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should have a status of 200', () => {
        result.status.should.be.equal(200);
      });

      it('should return a success message', () => {
        result.body.status.should.be.equal('success');
        result.body.message.should.be.equal('1 article updated successfully');
        result.body.article.title.should.be.equal(articleUpdateValid.title);
        result.body.article.description.should.be
          .equal(articleUpdateValid.description);
        result.body.article.tags.should.deep.equal(articleUpdateValid.tags);
        result.body.article.status.should.be.equal(articleUpdateValid.status);
      });
    });

    describe('with another users article', () => {
      before((done) => {
        chai.request(app)
          .patch(`/api/v1/articles/${articleData.id - 1}`)
          .send(articleUpdateValid)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should have a status of 403', () => {
        result.status.should.be.equal(403);
      });

      it('should return a success message', () => {
        result.body.status.should.be.equal('failure');
        result.body.errors.message[0].should.be
          .equal('you do not have permission to perform this operation');
      });
    });

    describe('with invalid status', () => {
      before((done) => {
        chai.request(app)
          .patch(`/api/v1/articles/${articleData.id}`)
          .send(articleUpdateInvalidStatus)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should have a status of 422', () => {
        result.status.should.be.equal(422);
      });

      it('should return a descriptive error message', () => {
        result.body.errors.status[0].should.be
          .equal('article status may only be \'draft\' or \'publish\'');
      });
    });

    describe('with invalid tags', () => {
      before((done) => {
        chai.request(app)
          .patch(`/api/v1/articles/${articleData.id}`)
          .send(articleUpdateInvalidTags)
          .set('Authorization', userData.token)
          .end((err, res) => {
            result.status = res.status;
            result.body = res.body;
            done();
          });
      });

      it('should have a status of 422', () => {
        result.status.should.be.equal(422);
      });

      it('should return a descriptive error message', () => {
        result.body.errors.tags[0].should.be
          .equal('tags must be an array of non-empty strings');
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
          .post(`${articleBaseUrl}/${articleId}/reaction/like`)
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
          .post(`${articleBaseUrl}/${articleId}/reaction/like`)
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
        result.body.message.should.be
          .equal('article like reversed successfully');
      });
    });

    describe('dislike an article', () => {
      before((done) => {
        // dislike an article
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/reaction/dislike`)
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
          .post(`${articleBaseUrl}/${articleId}/reaction/dislike`)
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
        result.body.message.should.be
          .equal('article dislike reversed successfully');
      });
    });

    describe('like then dislike of an article', () => {
      before((done) => {
        // like an article
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/reaction/like`)
          .set('Authorization', userData.token)
          .end(() => {
            done();
          });
      });

      before((done) => {
        // dislike the same article
        chai.request(app)
          .post(`${articleBaseUrl}/${articleId}/reaction/dislike`)
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
          .post(`${articleBaseUrl}/homerton-b-baleclava-1n2n1t/reaction/like`)
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
          .post(`${articleBaseUrl}/100000/reaction/like`)
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

  describe('Testing bookmarks', () => {
    it(`should throw error if user trys to fetch all 
    his or her bookmarked articles`,
    (done) => {
      chai.request(app)
        .get('/api/v1/users/bookmarks')
        .set('Authorization', userData.token)
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.status.should.be.eql('failure');
          res.body.errors.message[0].should.be
            .eql('you currently have no bookmarked articles');
          done();
        });
    });
    it('A signed up user should bookmark an article', (done) => {
      chai.request(app)
        .post('/api/v1/users/bookmarks/1')
        .set('Authorization', userData.token)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.status.should.be.eql('success');
          res.body.message.should.be.eql('Article bookmarked');
          res.body.bookmarkStatus.should.be.eql(true);
          done();
        });
    });
    it('signed user should be able to fetch all bookmarked articles',
      (done) => {
        chai.request(app)
          .get('/api/v1/users/bookmarks')
          .set('Authorization', userData.token)
          .end((err, res) => {
            res.status.should.be.eql(200);
            res.body.status.should.be.eql('success');
            res.body.message.should.be
              .eql('Bookmarked Articles fetched successfully');
            res.body.bookmarkedArticles.length.should.be.eql(1);
            done();
          });
      });
    it('A signed up user should be able to unbookmark an article', (done) => {
      chai.request(app)
        .post('/api/v1/users/bookmarks/1')
        .set('Authorization', userData.token)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.status.should.be.eql('success');
          res.body.message.should.be.eql('Article unbookmarked');
          res.body.bookmarkStatus.should.be.eql(false);
          done();
        });
    });
    it('should throw error if user trys to bookmark with an invalid url',
      (done) => {
        chai.request(app)
          .post('/api/v1/users/bookmarks/aa')
          .set('Authorization', userData.token)
          .end((err, res) => {
            res.status.should.be.eql(400);
            res.body.errors.message.should.be
              .eql('invalid id, article id must be a number');
            done();
          });
      });
    it(`should throw error if user trys to 
    unbookmark articlewith an invalid url`,
    (done) => {
      chai.request(app)
        .post('/api/v1/users/bookmarks/unbookmarkaa')
        .set('Authorization', userData.token)
        .end((err, res) => {
          res.status.should.be.eql(400);
          res.body.errors.message.should.be
            .eql('invalid id, article id must be a number');
          done();
        });
    });
  });

  describe('Report an article', () => {
    const token = createToken(1, '1d');
    it('should throw error if type field is missing', (done) => {
      chai.request(app)
        .post(`${articleBaseUrl}/2/reports`)
        .set('authorization', token)
        .send(articleReportDataNoType)
        .end((err, res) => {
          res.status.should.be.eql(400);
          res.body.errors.type.should.be
            .eql(['please enter a report type']);
          done();
        });
    });

    it('should throw error if report body field is missing', (done) => {
      chai.request(app)
        .post(`${articleBaseUrl}/2/reports`)
        .set('authorization', token)
        .send(articleReportDataNoReportBody)
        .end((err, res) => {
          res.status.should.be.eql(400);
          res.body.errors.reportBody.should.be
            .eql(['please enter a report body']);
          done();
        });
    });

    it('should not add report if type does not exist', (done) => {
      chai.request(app)
        .post(`${articleBaseUrl}/2/reports`)
        .set('authorization', token)
        .send(articleReportDataBadType)
        .end((err, res) => {
          res.status.should.be.eql(404);
          res.body.message.should.be
            .eql('The type you have provided does not exist');
          done();
        });
    });

    it('should not post a report if user is unauthenticated', (done) => {
      chai.request(app)
        .post(`${articleBaseUrl}/1/reports`)
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.status.should.be.eql('unauthorized');
          res.body.message.should.be.eql('please provide a token');
          done();
        });
    });

    it('should not post a report if user wrote the article', (done) => {
      chai.request(app)
        .post(`${articleBaseUrl}/1/reports`)
        .set('authorization', token)
        .send(articleReportData)
        .end((err, res) => {
          res.status.should.be.eql(403);
          res.body.status.should.be.eql('failure');
          res.body.message.should.be
            .eql('sorry, you cannot report an article you wrote');
          done();
        });
    });

    it('should report an article', (done) => {
      chai.request(app)
        .post(`${articleBaseUrl}/2/reports`)
        .set('authorization', token)
        .send(articleReportData)
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.status.should.be.eql('success');
          res.body.message.should.be
            .eql('your report was successfully submitted');
          done();
        });
    });
  });
});
