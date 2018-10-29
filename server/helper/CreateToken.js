import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET;
const lifeSpan = 60 * 60 * 24;
const dataPacket  = (id, email ) => {
    return {
        id , email
    }
}
const createToken = (id, email) => jwt.sign(dataPacket(id,email), secret, { expiresIn: lifeSpan });

export default createToken;
