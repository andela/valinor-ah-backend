import { Op } from 'sequelize';

import models from '../models';

const { User } = models;

/**
 * This is the passport callback function for google sign in
 * @param {string} accessToken
 * @param {sstring} refreshToken
 * @param {object} profile
 * @param {object} done
 * @returns {object} undefined
 */
const googleCallback = (accessToken, refreshToken, profile, done) => {
  const {
    id,
    name,
    emails,
    photos
  } = profile;

  const { givenName, familyName } = name;
  const email = emails[0].value;
  const avatarUrl = photos[0].value;

  User.findOrCreate({
    where: {
      [Op.or]: [{ email }, { googleId: `${id}` }],
    },
    defaults: {
      fullName: `${givenName} ${familyName}`,
      email,
      avatarUrl,
      googleId: id,
      confirmEmail: true,
    }
  }).spread((user, created) => {
    const userValues = user.get({ plain: true });
    userValues.created = created;
    return done(null, userValues);
  });
};

export default googleCallback;
