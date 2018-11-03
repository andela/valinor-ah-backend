import chai from 'chai';
import {
  createToken,
  verifyToken,
} from '../../../server/helpers/tokenUtils';

chai.should();

describe('Token Utils', () => {
  const result = {};
  const payload = 455;
  describe('Create the token', () => {
    before(() => {
      result.token = createToken(payload, 10000);
    });

    it('token should be a string', () => {
      result.token.should.be.a('string');
    });
  });

  describe('Verify the token', () => {
    before(() => {
      result.decoded = verifyToken(result.token);
    });

    it('should return the payload', () => {
      result.decoded.id.should.be.equal(payload);
    });
  });

  describe('Verify with no token provided', () => {
    before(() => {
      result.decoded = verifyToken();
    });

    it('should return a descriptive Error', () => {
      result.decoded.should.be.an('Error');
      result.decoded.message.should.equal('no token provided');
    });
  });

  describe('Verify with invalid token provided', () => {
    before(() => {
      result.decoded = verifyToken('diajosdaio');
    });

    it('should return a descriptive Error', () => {
      result.decoded.name.should.equal('JsonWebTokenError');
      result.decoded.message.should.equal('jwt malformed');
    });
  });
});
