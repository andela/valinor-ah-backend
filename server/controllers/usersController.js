import models from '../models';
import createToken from '../helper/createToken'
import bcrypt from 'bcrypt-nodejs';

const { User } = models;

/**
 * @class UserController
 * @description User related Operations
 */
class UserController{

/**
 * Represents signup.
 * @description This method create new user
 * @param {} req - request object.
 * @param {} res- response.
 */
    static signUp(req, res){
        const {fullName, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(`${password}`);
        return User
        .create({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        .then(user => res.status(201).json({
            status: 'success',
            message: 'New user created successfully',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                confirmEmail: user.confirmEmail,
                createdAt: user.createdAt,
                updateedAt: user.updatedAt,
                token: createToken(user.id, user.email),
            }
          }))
          .catch(err => res.status(500)
          .json({
            error: {
              message: err.message,
            },
          }));
    }
}

export default UserController;