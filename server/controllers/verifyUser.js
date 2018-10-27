import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return res.status(403).json({
      status: 'unauthorized',
      message: 'no token provided',
    });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      next(err);
    }
    const { user } = decoded;
    // TODO: find user then set status to active

    return res.status(200).json({
      status: 'success',
      message: `user email ${user.email} successufully verified`,
    });
  });
  return next();
};

export default verifyUser;
