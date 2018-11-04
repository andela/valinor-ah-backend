import { Op } from 'sequelize';

import models from '../models';

const { User } = models;


/**
 * @description This is the callback function for facebook's authentication
 * @param  {string} accessToken The access token returned by facebook
 * @param  {string} refreshToken The refresh token returned by facebook
 * @param  {object} profile The profile information returned by facebook
 * @param  {function} done The next function
 * @returns {object} undefined
 */
const facebookCallback = (accessToken, refreshToken, profile, done) => {
  const {
    id, emails, name, photos
  } = profile;
  const email = emails[0].value;
  const { givenName, familyName } = name;
  const avatarUrl = photos[0].value;
  User
    .findOrCreate({
      where: {
        [Op.or]: [{ email }, { facebookId: id }]
      },
      defaults: {
        email,
        fullName: `${givenName} ${familyName}`,
        avatarUrl,
        facebookId: id,
        confirmEmail: true
      }
    })
    .spread((user) => {
      const userInfo = {
        id: user.dataValues.id,
        fullName: user.dataValues.fullName,
        email: user.dataValues.email,
        confirmEmail: user.dataValues.confirmEmail,
        avatarUrl: user.dataValues.avatarUrl,
        facebookId: user.dataValues.facebookId
      };
      return done(null, userInfo);
    });
};

export default facebookCallback;
