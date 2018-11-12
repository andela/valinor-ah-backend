import chai from 'chai';
import sendEmail from '../../../server/helpers/sendEmail';

const should = chai.should();

const user = {
  id: 'bf672b87-7d50-4baa-a12b-990f58f3c7f8',
  email: 'ja.ogunniyi@gmail.com',
};

const message = {
  subject: 'Welcome to Author\'s Haven! Please Confirm your email',
  body:
  `<strong>
    Click 
      <a href="http://localhost:3001/api/test/verify">
        here
      </a> 
    to verify your email
  </strong>`,
};

describe('Send email to user', () => {
  let result;
  describe('with valid email', () => {
    before(() => {
      result = sendEmail(user, message);
    });
    it('should return null', () => {
      should.equal(result, null);
    });
  });

  describe('with no email', () => {
    before(() => {
      user.email = '';
      result = sendEmail(user, message);
    });
    it('should return appropriate error message', () => {
      result.should.be.an('Error');
      result.message.should.equal('no email address');
    });
  });

  describe('with no subject', () => {
    before(() => {
      user.email = 'ja.ogunniyi@gmail.com';
      message.subject = '';
      result = sendEmail(user, message);
    });
    it('should return appropriate error message', () => {
      result.should.be.an('Error');
      result.message.should.equal('message subject should not be empty');
    });
  });

  describe('with no body', () => {
    before(() => {
      message.subject = 'Welcome to Author\'s Haven! Please Confirm your email';
      message.body = '';
      result = sendEmail(user, message);
    });
    it('should return appropriate error message', () => {
      result.should.be.an('Error');
      result.message.should.equal('message body should not be empty');
    });
  });
});
