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
        <p>
          <a href="http://localhost:3001/api/test/verify?token=${token}">
          <strong>
            CLICK HERE!
          </strong>
          </a> 
          to verify your email
        </p>
      </div>`,
  };
};

/**
 * @description verifyEmailMessage contains the email message template
 * @param {object} resetUrl - The password reset URL
 * @returns {object} - contains the mail message template
 */
const forgotPasswordEmail = resetUrl => ({
  subject: 'Authors Haven Password Reset',
  body:
    `<p>
      Click <a href="${resetUrl}">here</a> to reset your password.
    </p>`
});

/**
 * @description verifyEmailMessage contains the email message template
 * @returns {object} - contains the mail message template
 */
const resetPasswordEmail = () => ({
  subject: 'Authors Haven Password Reset',
  body:
    `<p>
      Your password has successfully been reset.
    </p>`
});

export { resetPasswordEmail, verifyEmailMessage, forgotPasswordEmail };
