import chai from 'chai';
import verifyEmailMessage from '../../../server/helpers/verifyEmailMessage';

chai.should();

let result;

describe('Verify Email Message', () => {
  it('should return error if the token is empty', () => {
    result = verifyEmailMessage('');
    result.should.deep.equal({
      errors: {
        token: ['please provide a token'],
        protocol: ['please provide a protocol'],
        address: ['please provide an address']
      }
    });
  });
  it('should return error if the token is undefined', () => {
    result = verifyEmailMessage(undefined);
    result.should.deep.equal({
      errors: {
        token: ['please provide a token'],
        protocol: ['please provide a protocol'],
        address: ['please provide an address']
      }
    });
  });
  it('should return error if the protocol is not supplied', () => {
    result = verifyEmailMessage('87401374874300947180347310');
    result.should.deep.equal({
      errors: {
        protocol: ['please provide a protocol'],
        address: ['please provide an address']
      }
    });
  });
  it('should return error if the address is not supplied', () => {
    result = verifyEmailMessage('87401374874300947180347310', 'https');
    result.should.deep.equal({
      errors: {
        address: ['please provide an address']
      }
    });
  });
});
