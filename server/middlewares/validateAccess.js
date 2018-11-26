import getRoleId from '../helpers/getRoleId';
import errorResponse from '../helpers/errorResponse';
/**
 * This middleware takes care of permissions across the app
 * @param {array} arrayOfPermissions - an arrayOfPermissions
 * @returns {void}
 */
const validateAccess = arrayOfPermissions => async (req, res, next) => {
  const { id } = req.userData;
  let hasAccess = false;
  let isOwner = false;
  let isAdmin = false;

  try {
    const roleId = await getRoleId(id);
    let data;
    switch (roleId) {
      case 1: data = 'ADMIN';
        break;
      case 2: data = 'AUTHOR';
        break;
      case 3: data = 'USER';
        break;
      default:
    }
    if (arrayOfPermissions.indexOf(data) !== -1) hasAccess = true;
    if (!hasAccess) {
      return errorResponse(
        '', res, 'you do not have permission to perform this operation', 403
      );
    }

    if (roleId === 1) {
      isAdmin = true;
      req.isAdmin = true;
    }
    // check if requester is the owner or resource
    const {
      articleData,
      resourceUserData,
      commentData
    } = req;
    if (articleData && !isAdmin) {
      isOwner = articleData.userId === id;
    }
    if (resourceUserData && !isAdmin) {
      isOwner = resourceUserData.userId === id;
    }
    if (commentData && !isAdmin) {
      isOwner = commentData.userId === id;
    }
    req.isOwner = isOwner;
    if (!isAdmin && !isOwner) {
      return errorResponse(
        '', res, 'you do not have permission to perform this operation', 403
      );
    }
    return next();
  } catch (err) {
    return next(err);
  }
};


export default validateAccess;
