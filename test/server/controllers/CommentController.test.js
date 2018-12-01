import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';
import { createToken } from '../../../server/middlewares/tokenUtils';

const should = chai.should();

chai.use(chaiHttp);
const signupUrl = '/api/v1/users/signup';
const articleBaseUrl = '/api/v1/articles';
const verifyUserUrl = '/api/v1/users/verify?token=';
let articleId;
let commentId;

const userData = {};

describe('Testing comment on articles', () => {
  it('should create new user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Solomon Kingsley',
        email: 'abiodun.abud@andela.com'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        userData.id = 6;
        userData.token = createToken(6, '1h');
        done();
      });
  });
  it('POST /article/:articleId/comments add new comment', (done) => {
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
        done();
      });
  });
  it('POST /article/:articleId/comments should not add new comment', (done) => {
    chai.request(app)
      .post('/api/v1/articles/1/comments')
      .set('authorization', userData.token)
      .send({
        body: '   '
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.errors.should.be.a('object');
        done();
      });
  });
  it(
    'POST /article/:articleId/comments should not add new comment if no body',
    (done) => {
      chai.request(app)
        .post('/api/v1/articles/1/comments')
        .set('authorization', userData.token)
        .send({
          bosddy: 'ljasnd'
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.errors.should.be.a('object');
          done();
        });
    }
  );
});

describe('Testing like or disliked comment', () => {
  articleId = 10;
  commentId = 1;
  it('should not like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('unauthorized');
        res.body.errors.message.should.be.eql(
          'please confirm your email then try again'
        );
        done();
      });
  });
  it('should not dislike comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('unauthorized');
        res.body.errors.message.should.be.eql(
          'please confirm your email then try again'
        );
        done();
      });
  });
  it('Should GET /api/users/verify?token=', (done) => {
    chai.request(app)
      .get(
        `${verifyUserUrl}${userData.token}`
      )
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('Email confirmed successfully');
        done();
      });
  });
  it('Should like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment successfully liked');
        done();
      });
  });
  it('Should like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/dislike`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql(
          'you changed your mind, comment successfully disliked'
        );
        done();
      });
  });
  it(
    'Should undo like',
    (done) => {
      chai.request(app)
        .post(
          `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
        )
        .set('authorization', userData.token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.status.should.be.eql('success');
          res.body.message.should.be.eql(
            'you changed your mind, comment successfully liked'
          );
          done();
        });
    }
  );
  it('Should not like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/${commentId}/reaction/like`
      )
      .set('authorization', `${userData.token}s`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('unauthorized');
        res.body.message.should.be.eql('invalid token!');
        done();
      });
  });
  it('Should dislike comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          2/reaction/dislike`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment successfully disliked');
        done();
      });
  });
  it('Should undo dislike', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          2/reaction/dislike`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment dislike reversed successfully');
        done();
      });
  });
  it('Should like comment', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          2/reaction/like`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('success');
        res.body.message.should.be.eql('comment successfully liked');
        done();
      });
  });
  it('Should not dislike', (done) => {
    chai.request(app)
      .post(
        `${articleBaseUrl}/${articleId}/comments/
          ${commentId}/reaction/dislikes`
      )
      .set('authorization', userData.token)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.status.should.be.eql('failure');
        res.body.errors.message.should.be.eql(
          'unknown action, you may either like or dislike only'
        );
        done();
      });
  });
});

describe('edit a comment', () => {
  const editResult = {};
  const comment = {};
  before((done) => {
    userData.token = createToken(1, '1m');
    // edit a comment
    chai.request(app)
      .patch('/api/v1/comments/5')
      .set('authorization', userData.token)
      .send({
        body: 'I meant it is Working prefectly',
      })
      .end((err, res) => {
        editResult.status = res.status;
        editResult.body = res.body;
        done();
      });
  });

  before((done) => {
    // get the comment
    chai.request(app)
      .get('/api/v1/comments/5')
      .set('authorization', userData.token)
      .end((err, res) => {
        comment.status = res.status;
        comment.body = res.body.comment;
        done();
      });
  });

  it('should have a status of 200', () => {
    editResult.status.should.be.equal(200);
    comment.status.should.be.equal(200);
  });
  it('should have a success response', () => {
    editResult.body.message.should.be.equal('1 comment successfully updated');
    comment.body.current.id.should.be.equal(5);
    comment.body.history.should.be.an('Array');
    comment.body.history.length.should.be.equal(1);
  });
});

describe('edit a comment with no change', () => {
  const editNoChange = {};
  before((done) => {
    // edit the same comment again with no change
    chai.request(app)
      .patch('/api/v1/comments/5')
      .set('authorization', userData.token)
      .send({
        body: 'I meant it is Working prefectly',
      })
      .end((err, res) => {
        editNoChange.status = res.status;
        editNoChange.body = res.body;
        done();
      });
  });

  it('should have a status of 409', () => {
    editNoChange.status.should.be.equal(409);
  });
  it('should have a descriptive error response', () => {
    editNoChange.body.errors.message.should.be
      .equal('you must make changes to update');
    editNoChange.body.status.should.be.equal('failure');
  });
});

describe('Delete a comment', () => {
  const token = createToken(1, '1m');

  it('should not delete a comment if a token is missing', (done) => {
    chai.request(app)
      .delete('/api/v1/comments/5')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.status.should.eql(401);
        res.body.status.should.eql('unauthorized');
        res.body.message.should.eql('please provide a token');
        done();
      });
  });

  it('should throw error if comment is not found', (done) => {
    chai.request(app)
      .delete('/api/v1/comments/400')
      .set('authorization', token)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.status.should.eql(404);
        res.body.status.should.eql('failure');
        done();
      });
  });

  it('should not delete a comment if user did not make the comment', (done) => {
    chai.request(app)
      .delete('/api/v1/comments/4')
      .set('authorization', token)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.status.should.eql(403);
        res.body.status.should.eql('failure');
        res.body.errors.message[0].should
          .eql('you do not have permission to perform this operation');
        done();
      });
  });

  it('should delete a comment if user made the comment', (done) => {
    chai.request(app)
      .delete('/api/v1/comments/5')
      .set('authorization', token)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.status.should.eql(200);
        res.body.status.should.eql('success');
        res.body.message.should.eql('Comment has been deleted');
        done();
      });
  });
});

describe('Commenting on a comment', () => {
  it('should comment on a comment', (done) => {
    chai.request(app)
      .post(`${articleBaseUrl}/comments/1`)
      .set('authorization', userData.token)
      .send({
        body: 'testing replying to a comment'
      })
      .end((err, res) => {
        should.equal(res.status, 201);
        should.equal(res.body.status, 'success');
        should.equal(res.body.message, 'reply successfully added');
        done();
      });
  });
});
