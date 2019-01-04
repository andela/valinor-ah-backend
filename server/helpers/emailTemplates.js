/* eslint-disable max-len */
import dotenv from 'dotenv';

dotenv.config();
// eslint-disable-next-line max-len
const logoUrl = 'https://res.cloudinary.com/vivavalinor/image/upload/v1546419888/Logo.png';
/**
 * @description verifyEmailMessage contains the email message template
 * @param {string} token - The token generated for the user
 * @returns {object} - contains the mail message template
 */

const verifyEmailMessage = (token) => {
  const err = { errors: {} };
  if (token === undefined || token.trim() === '') {
    err.errors.token = ['please provide a token'];
  }

  if (Object.keys(err.errors).length > 0) {
    return err;
  }

  return {
    subject: 'Welcome to Author\'s Haven! Please Confirm your email',
    body:
    `<div style="padding:0.5em; font-family:sans-serif; margin: 0 auto;">
      <div style="background-color: #e8e9ea; height: 6em; padding-top: 3em">
        <div style="height: 3em;  background-image: url(${logoUrl}); background-repeat: no-repeat; background-size: contain; background-position: center;">
        </div>
      </div>

      <div style="text-align: center; padding: 3em 0;">
        <h1 style="font-weight:400;">Thanks for signing up!</h1>
        <p>Click the button below and verify your email.</p>
        <a style="margin: 1em auto;display: block;height: 25px;background: #007fff;text-align: center;border-radius: 5px;color: white;padding: 0.8em 0.6em 0.2em;width:120px; text-decoration:none" href="${process.env.FRONT_END_BASE_URL}/VerifyPage?token=${token}">Verify Email</a>
        <p>This link will expire in one hour.</p>
      </div>
      <div style="padding: 0.1em; bottom: 0; text-align: center; font-size: 0.8em">
        <hr style="height:1px; border:none; color:#e8e9ea; background-color:#e8e9ea; width:60%; text-align:center; margin: 0 auto;">
        <p>&#169; 2018 Author's Haven</p>
      </div>
    </div>`,
  };
};

/**
 * @description loginEmailMessage contains the email message template
 * @param {string} loginUrl - The token generated for the user
 * @returns {object} - contains the mail message template
 */

const loginLinkMessage = (loginUrl, token) => {
  const err = { errors: {} };

  if (token === undefined || token.trim() === '') {
    err.errors.token = ['please provide a token'];
  } if (Object.keys(err.errors).length > 0) {
    return err;
  }
  return {
    subject: 'Welcome to Author\'s Haven',
    body:
    `<div style="padding:0.5em; font-family:sans-serif; margin: 0 auto;">
      <div style="background-color: #e8e9ea; height: 6em; padding-top: 3em">
        <div style="height: 3em;  background-image: url(${logoUrl}); background-repeat: no-repeat; background-size: contain; background-position: center;">
        </div>
      </div>
      
      <div style="text-align: center; padding: 3em 0;">
        <p>Click and confirm that you want to sign in to Author's Haven. This link will expire in one hour.</p>
        <a style="margin: 1em auto;display: block;height: 25px;background: #007fff;text-align: center;border-radius: 5px;color: white;padding: 0.8em 0.6em 0.2em;width:120px; text-decoration:none" href="${loginUrl}">Login</a>
        <p style="padding-top: 2em; text-align: center; font-size: 0.8em">Thanks <br>Author's Haven</p>
      </div>
      <div style="padding: 0.1em; bottom: 0; text-align: center; font-size: 0.8em">
        <hr style="height:1px; border:none; background-color:#e8e9ea; width:60%; text-align:center; margin: 0 auto;">
        <p>&#169; 2018 Author's Haven</p>
      </div>
    </div>`
  };
};

const deleteAccountMessage = (token) => {
  const message = {
    subject: 'Delete you Author\'s Haven account',
    body:
    `<div style="padding:1em; font-family:sans-serif; margin: 0 auto;">
      <div style="background-color: #e8e9ea; height: 6em; padding-top: 3em">
        <div style="height: 3em;  background-image: url(${logoUrl}); background-repeat: no-repeat; background-size: contain; background-position: center;">
        </div>
      </div>
      
      <div style="text-align: center; padding: 3em 0;">
       <p>We have received a request to delete your account. Click and confirm that you want to delete your Author's Haven account. This link will expire in one hour.</p>
       <a style="margin: 1em auto;display: block;height: 25px;background: #ff0000;text-align: center;border-radius: 5px;color: white;padding: 0.8em 0.6em 0.2em;width:120px; text-decoration:none" href="${process.env.API_BASE_URL}/users/account/delete?token=${token}">Delete Account</a>
        <p>If this action was not initiated by you, click
          <a style="text-decoration:none;" href="fakeloguseroutofaccounts">
          <strong>here</strong>
          </a>
        </p>
        <p style="padding-top: 2em; text-align: center; font-size: 0.8em">Thanks <br>Author's Haven</p>
      </div>
      <div style="padding: 0.1em; bottom: 0; text-align: center; font-size: 0.8em">
        <hr style="height:1px; border:none; background-color:#e8e9ea; width:60%; text-align:center; margin: 0 auto;">
        <p>&#169; 2018 Author's Haven</p>
      </div>
    </div>
    `
  };
  return message;
};

const follow = (senderId, type) => ({
  subject: `New ${type}`,
  body: `You have a new follower.
  Check it out at ${process.env.API_BASE_URL}/users/${senderId}`
});

const unfollow = (senderId, type) => ({
  subject: `New ${type}`,
  body: `Someone has unfollowed you.
  Check it out at ${process.env.API_BASE_URL}/users/${senderId}`
});

const like = (url, type) => ({
  subject: `New ${type}`,
  body: `You have a new like.
  Check it out at ${url}`
});

const comment = (url, type) => ({
  subject: `New ${type}`,
  body: `You have a new comment.
  Check it out at ${url}`
});

export {
  loginLinkMessage,
  verifyEmailMessage,
  follow,
  unfollow,
  like,
  comment,
  deleteAccountMessage
};
