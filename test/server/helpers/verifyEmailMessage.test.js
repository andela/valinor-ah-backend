import chai from 'chai';
import { verifyEmailMessage } from '../../../server/helpers/emailTemplates';

chai.should();

let result;

describe('Verify Email Message', () => {
  it('should return error if the token is empty', () => {
    result = verifyEmailMessage('');
    result.should.deep.equal({
      errors: {
        token: ['please provide a token']
      }
    });
  });
  it('should return error if the token is undefined', () => {
    result = verifyEmailMessage(undefined);
    result.should.deep.equal({
      errors: {
        token: ['please provide a token']
      }
    });
  });
});
