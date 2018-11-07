import chai from 'chai';
import verifyEmailMessage from '../../../server/helpers/verifyEmailMessage';

chai.should();

let result;

describe('Verify Email Message', () => {
  it('should return error if the token is empty', () => {
    result = verifyEmailMessage('');
    result.should.be.an('Error');
    result.message.should.equal('No token provided');
    result.status.should.equal(401);
  });
  it('should return error if the token is undefined', () => {
    result = verifyEmailMessage(undefined);
    result.should.be.an('Error');
    result.message.should.equal('No token provided');
    result.status.should.equal(401);
  });
  it('should return error if the protocol is not supplied', () => {
    result = verifyEmailMessage('87401374874300947180347310');
    result.should.be.an('Error');
    result.message.should.equal('please provide a protocol');
    result.status.should.equal(422);
  });
  it('should return error if the address is not supplied', () => {
    result = verifyEmailMessage('87401374874300947180347310', 'https');
    result.should.be.an('Error');
    result.message.should.equal('please provide an address');
    result.status.should.equal(422);
  });
});
