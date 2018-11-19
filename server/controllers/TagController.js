import models from '../models';

const { Tag } = models;

/**
 * @description - contains all tags related operations
 * @class TagController
 */
class TagController {
  /**
     * @description - get all tags in the database
     * @param {object} req
     * @param {object} res
     * @param {object} next
     * @returns {void} -
     */
  static async getAllArticleTags(req, res, next) {
    let tags;
    try {
      tags = await Tag.findAndCountAll({
        attributes: ['id', 'tagName'],
        order: [['tagName']],
      });
    } catch (err) {
      next(err);
    }
    return res.status(200).json({
      status: 'success',
      tags,
    });
  }
}

export default TagController;
