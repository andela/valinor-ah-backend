import models from '../models';

const { Follow, User } = models;

const getFollowViews = (queryParam, userId, view) => Follow.findAll({
  where: {
    [`${queryParam}`]: userId
  },
  attributes: [],
  include: [{
    model: User,
    as: view,
    attributes: ['id', 'fullName', 'avatarUrl']
  }]
});

export default getFollowViews;
