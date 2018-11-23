import models from '../models';

const { User } = models;
/**
 * This helper function gets the roleId of a user
 * @param {integer} id -  the id of the logged in user
 * @returns {integer} roleId of the user
 */
const getRoleId = async (id) => {
  try {
    const user = await User.findByPk(id);
    const { roleId } = user;
    return roleId;
  } catch (err) {
    return err;
  }
};

export default getRoleId;
