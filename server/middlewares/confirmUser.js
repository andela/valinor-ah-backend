import models from '../models';

const { User } = models;

const verifyUserConfirmed = (req, res, next) => {
  const { id } = req.userData;

  User.findByPk(id)
    .then((user) => {
      if (!user) {
        // checks if user exists
        const error = new Error('user not found');
        error.status = 404;
        return next(error);
      }
      if (!user.dataValues.confirmEmail) {
        // checks if user email is confirmed
        // eslint-disable-next-line max-len
        const confirmEmailError = new Error('please confirm your email then try again');
        confirmEmailError.status = 403;
        confirmEmailError.statusMessage = 'unauthorized';
        return next(confirmEmailError);
      }
      return next();
    })
    .catch(err => next(err));
};

export default verifyUserConfirmed;
