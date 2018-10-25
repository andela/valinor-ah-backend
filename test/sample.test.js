var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

describe('Users', function() {
  it('should GET a list of ALL users', function(done) {
    chai.request(server)
      .get('/users')
      .end(function(err, res){
        should.not.exist(err);
        res.should.have.status(200);
        done();
      });
  });
});
