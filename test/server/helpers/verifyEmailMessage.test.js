import chai from 'chai';
import verifyEmailMessage from '../../../server/helpers/verifyEmailMessage';

chai.should();

let result;

describe('Verify Email Message', () => {
  it('should return error if the token is empty', () => {
    result = verifyEmailMessage('');
    result.should.be.an('Error');
    result.message.should.equal('token is invalid');
    result.status.should.equal(401);
  });
  it('should return error if the token is undefined', () => {
    result = verifyEmailMessage(undefined);
    result.should.be.an('Error');
    result.message.should.equal('token is invalid');
    result.status.should.equal(401);
  });
});
