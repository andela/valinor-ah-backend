import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../../../app';

const should = chai.should();
chai.use(chaiHttp);
const getAnArticleUrl = string => `/api/v1/articles/${string}`;

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
