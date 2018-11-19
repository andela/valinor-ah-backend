import chai from 'chai';
import app from '../../../app';

chai.should();

const getAllTagUrl = '/api/v1/articles/tags';


describe('Testing TagController', () => {
  const result = {};
  before((done) => {
    chai.request(app)
      .get(`${getAllTagUrl}`)
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
    result.body.tags.rows.should.be.an('Array');
    result.body.tags.rows[0].tagName.should.be.equal('basketball');
    result.body.tags.rows[1].tagName.should.be.equal('conventions');
    result.body.tags.rows[2].tagName.should.be.equal('football');
  });
});
