import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * This function sends a mail to user
 * @param {object} user object containing user email and uuid
 * @param {object} message object containing message subject and content body
 * @returns {object} error object, null if successful
 */
const sendEmail = (user, message) => {
  if (!user.email) {
    return new Error('no email address');
  }
  if (!message.subject || message.subject.trim() === '') {
    return new Error('message subject should not be empty');
  }
  if (!message.body || message.body.trim() === '') {
    return new Error('message body should not be empty');
  }
  const mail = {
    to: user.email,
    from: 'Author\'s Haven<no-reply@authorshaven.com>',
    subject: message.subject,
    html: message.body,
  };
  sgMail.send(mail);
  return null;
};

export default sendEmail;
