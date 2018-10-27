import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * This function sends a verification mail to users address
 * @param {object} user object containing user info
 * @returns {void}
 */
const sendVerification = async (user) => {
  if (!user.email) {
    return new Error('no email address');
  }
  let error;
  let verificationToken;
  // generate jwt with the user object as the payload
  await jwt.sign({ user }, process.env.SECRET, (err, token) => {
    if (err) {
      // return err if there was an error
      error = err;
    }
    verificationToken = token;
    const verificationLink = `
      http://localhost:3000/users/verify?token=${token}`;
    const message = {
      to: user.email,
      from: 'Author\'s Haven<no-reply@authorshaven.com>',
      subject: 'Welcome to Author\'s Haven! Confirm your Email',
      html:
      `<strong>
        Click <a href="${verificationLink}">here</a> to verify
      </strong>`,
    };
    sgMail.send(message);
  });
  if (error) {
    return error;
  }
  return verificationToken;
};

export default sendVerification;
