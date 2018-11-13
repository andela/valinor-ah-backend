import httpMocks from 'node-mocks-http';

import errorResponse from '../../../server/helpers/errorResponse';

describe('Testing 500 error response function - unit test', () => {
  it('testing', (done) => {
    const err = {
      message: ''
    };
    const res = httpMocks.createResponse();
    errorResponse(err, res);
    res.statusCode.should.be.eql(500);
    res.statusMessage.should.be.eql('OK');
    done();
  });
});
