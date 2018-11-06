/**
 * @description verifyEmailMessage contains the email message template
 * @param {string} token - The token generated for the user
 * @returns {object} - contains the mail message template
 */

const verifyEmailMessage = (token) => {
  if (token === undefined || token === '') {
    const err = new Error('token is invalid');
    err.status = 401;
    return err;
  }
  return {
    subject: 'Welcome to Author\'s Haven! Please Confirm your email',
    body:
    `<div style="height: 20em, background-color: #E6FFED; 
      border: 1px solid black; padding: 0.5em;">
        <p>
          <a href="http://localhost:3001/api/v1/users/verify?token=${token}">
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
