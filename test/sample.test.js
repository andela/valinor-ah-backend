import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';

chai.use(chaiHttp);

chai.should();

describe('Example Node Server', () => {
  it('should return 200', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
