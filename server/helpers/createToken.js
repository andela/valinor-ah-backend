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
const createToken = (id, lifeSpan) => jwt
  .sign({ id }, secret, { expiresIn: lifeSpan });

export default createToken;
