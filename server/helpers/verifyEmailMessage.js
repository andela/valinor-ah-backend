import dotenv from 'dotenv';

dotenv.config();
/**
 * @description verifyEmailMessage contains the email message template
 * @param {string} token - The token generated for the user
 * @returns {object} - contains the mail message template
 */

const verifyEmailMessage = (token, protocol, address) => {
  const err = {};
  if (token === undefined || token.trim() === '') {
    err.token = ['No token provided'];
  } if (protocol === undefined || protocol.trim() === '') {
    err.protocol = ['please provide a protocol'];
  } if (address === undefined || address.trim() === '') {
    err.address = ['please provide an address'];
  }
  console.log('err============+>', err);
  console.log('err,keys============+>', Object.keys(err));
  console.log('err,length============+>', Object.keys(err).length);
  if (Object.keys(err).length > 0) {
    const error = new Error(JSON.stringify(err));
    error.status = 422;
    console.log('error============>', error);
    return error;
  }
  return {
    subject: 'Welcome to Author\'s Haven! Please Confirm your email',
    body:
    `<div style="height: 20em, background-color: #E6FFED; 
      border: 1px solid black; padding: 0.5em;">
        <p>
          <a href="${protocol}://${address}/api/v1/users/verify?token=${token}">
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
