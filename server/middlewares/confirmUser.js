import models from '../models';

const { User } = models;

const confirmUser = async (req, res, next) => {
  const { id } = req.userData;

  let user;
  try {
    user = await User.findByPk(id);
  } catch (error) {
    next(error);
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
};

export default confirmUser;
