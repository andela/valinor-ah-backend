const resetPasswordEmail = resetUrl => ({
  subject: 'Authors Haven Password Reset',
  body:
    `<p>
      Click <a href="${resetUrl}">here</a> to reset your password.
    </p>`
});

export default resetPasswordEmail;
