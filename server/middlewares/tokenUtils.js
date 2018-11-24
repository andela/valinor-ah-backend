import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import models from '../models';

const { User } = models;

dotenv.config();

const secret = process.env.JWT_SECRET;

/**
 *
 * @param {integer} id - The id of the user
 * @param {integer} lifeSpan - The the lifespan of the token
 * @returns {void}
 */
export const createToken = (id, lifeSpan) => {
  if (!lifeSpan) return jwt.sign({ id }, secret);
  return jwt.sign({ id }, secret, { expiresIn: lifeSpan });
};

/**
 * This middleware protects a route from access without a token
 * sets the payload in res.locals
 * @param {object} req - express request object
 * @param {object} res - express response object
 * @param {object} next - express next to pass to next middleware
 * @returns {void}
 */
export async function verifyToken(req, res, next) {
  const token = req.headers.authorization || req.query.token;
  if (!token) {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'please provide a token'
    });
  }

  let isValid;

  try {
    req.userData = jwt.verify(token, secret);
    const { id } = req.userData;
    if (id) {
      isValid = await User.findByPk(id);
      if (!isValid) {
        return res.status(401).json({
          status: 'unauthorized',
          errors: {
            message: 'Session has expired. Please login or signup'
          }
        });
      }
    }
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'unauthorized',
      message: 'token expired!'
    });
  }
}
