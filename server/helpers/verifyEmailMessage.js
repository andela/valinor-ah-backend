import dotenv from 'dotenv';

dotenv.config();
/**
 * @description verifyEmailMessage contains the email message template
 * @param {string} token - The token generated for the user
 * @returns {object} - contains the mail message template
 */

const verifyEmailMessage = (token) => {
  const err = { errors: {} };
  if (token === undefined || token.trim() === '') {
    err.errors.token = ['please provide a token'];
  } if (Object.keys(err.errors).length > 0) {
    return err;
  }
  return {
    subject: 'Welcome to Author\'s Haven! Please Confirm your email',
    body:
    `<div style="height: 20em, background-color: #E6FFED; 
      border: 1px solid black; padding: 0.5em;">
        <p>
          <a href="${process.env.API_BASE_URL}/users/verify?token=${token}">
          <strong>
            CLICK HERE!
          </strong>
          </a> 
          to verify your email
        </p>
      </div>`,
  };
};

export default verifyEmailMessage;
