import { Op } from 'sequelize';

import models from '../models';

const { User } = models;

/**
 * @description This is the callback function for twitter's authentication
 * @param  {string} accessToken The access token returned by twitter
 * @param  {string} tokenSecret The token secret returned by twitter
 * @param  {object} profile The profile information returned by twitter
 * @param  {function} done The next function
 * @returns {object} undefined
 */
const twitterCallback = (accessToken, tokenSecret, profile, done) => {
  const {
    id, emails, photos
  } = profile;
  const email = emails[0].value;
  const avatarUrl = photos[0].value;

  User
    .findOrCreate({
      where: {
        [Op.or]: [{ email }, { twitterId: id }]
      },
      defaults: {
        twitterId: id,
        email,
        avatarUrl,
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
        twitterId: user.dataValues.twitterId
      };

      return done(null, userInfo);
    });
};

export default twitterCallback;
