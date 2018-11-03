import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET;

/**
 *
 * @param {integer} id - The id of the user
 * @param {integer} lifeSpan - The the lifespan of the token
 * @returns {void}
 */
export const createToken = (id, lifeSpan) => jwt
  .sign({ id }, secret, { expiresIn: lifeSpan });

/**
 * Verifies the jwt and returns the payload
 * @param {string} token - The jwt to be verified
 * @returns {object} object containing user Id
 */
export const verifyToken = (token) => {
  if (!token) {
    return new Error('no token provided');
  }
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return err;
  }
};
