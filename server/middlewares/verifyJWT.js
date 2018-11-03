import { verifyToken } from '../helpers/tokenUtils';

/**
 * This middleware protects a route from access without a token
 * sets the payload in res.locals
 * @param {object} req - express request object
 * @param {object} res - express response object
 * @param {object} next - express next to pass to next middleware
 * @returns {void}
 */
const verifyJWT = (req, res, next) => {
  // get token from request header
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error('no token provided');
    error.status = 401;
    return next(error);
  }
  res.locals.payload = verifyToken(token);
  next();
};

export default verifyJWT;
