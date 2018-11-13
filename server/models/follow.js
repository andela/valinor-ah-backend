export default (sequelize, DataTypes) => {
  const getFollowViews = (queryParam, userId, view) => sequelize.models.Follow
    .findAll({
      where: {
        [`${queryParam}`]: userId
      },
      attributes: [],
      include: [{
        model: sequelize.models.User,
        as: view,
      }]
    });

  const Follow = sequelize.define('Follow', {
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    followerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    hooks: {
      afterCreate: (follow) => {
        getFollowViews(
          'authorId', follow.authorId, 'follower'
        )
          .then((followerView) => {
            getFollowViews('followerId', follow.authorId, 'following')
              .then((followingView) => {
                const following = followingView.length;
                const followers = followerView.length;
                sequelize.models.User.update({
                  following,
                  followers
                }, {
                  where: {
                    id: follow.authorId
                  }
                })
                  .then(() => {
                    getFollowViews(
                      'authorId', follow.followerId, 'follower'
                    )
                      .then((secondFollowerView) => {
                        getFollowViews(
                          'followerId', follow.followerId, 'following'
                        )
                          .then((secondFollowingView) => {
                            const secondFollowing = secondFollowingView.length;
                            const secondFollowers = secondFollowerView.length;
                            sequelize.models.User.update({
                              following: secondFollowing,
                              followers: secondFollowers
                            }, {
                              where: {
                                id: follow.followerId
                              }
                            });
                          });
                      });
                  });
              });
          });
      },
      afterBulkDestroy: (follow) => {
        getFollowViews('authorId', follow.where.authorId, 'follower')
          .then((followerView) => {
            getFollowViews('followerId', follow.where.authorId, 'following')
              .then((followingView) => {
                const following = followingView.length;
                const followers = followerView.length;
                sequelize.models.User.update({
                  following,
                  followers
                }, {
                  where: {
                    id: follow.where.authorId
                  }
                })
                  .then(() => {
                    getFollowViews(
                      'authorId', follow.where.followerId, 'follower'
                    )
                      .then((secondFollowerView) => {
                        getFollowViews(
                          'followerId', follow.where.followerId, 'following'
                        )
                          .then((secondFollowingView) => {
                            const secondFollowing = secondFollowingView.length;
                            const secondFollowers = secondFollowerView.length;
                            sequelize.models.User.update({
                              following: secondFollowing,
                              followers: secondFollowers
                            }, {
                              where: {
                                id: follow.where.followerId
                              }
                            });
                          });
                      });
                  });
              });
          });
      }
    }
  });
  Follow.associate = (models) => {
    const { User } = models;
    Follow.belongsTo(User, {
      as: 'following',
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });
    Follow.belongsTo(User, {
      as: 'follower',
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };
  return Follow;
};
