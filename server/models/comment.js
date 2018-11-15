export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeBulkUpdate: (comment) => {
        sequelize.models.Comment.findOne({
          where: { id: comment.where.id }
        }).then((oldComment) => {
          sequelize.models.CommentEvent.create({
            commentId: oldComment.dataValues.id,
            previousBody: oldComment.dataValues.body,
          });
        });
      }
    }
  });
  Comment.associate = (models) => {
    // associations can be defined here
    const { Article, User, CommentLike } = models;
    Comment.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(User, {
      as: 'author',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comment.hasMany(CommentLike, {
      foreignKey: 'commentId',
    });
  };
  return Comment;
};
