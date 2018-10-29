import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET;
const lifeSpan = 60 * 60 * 24;

/**
 *
 * @param {*} id - The id of the user
 * @param {*} email - The email of the user
 * @returns {object} - returns an object containing id and email
 */
const dataPacket = (id, email) => ({
  id, email
});

const createToken = (id, email) => jwt.sign(
  dataPacket(id, email), secret, { expiresIn: lifeSpan }
);

export default createToken;
