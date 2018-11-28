export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      allowNull: false,
      type: DataTypes.STRING
    },
    inlineComment: {
      allowNull: true,
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
    const {
      Article,
      User,
      CommentLike,
      CommentReply
    } = models;
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
    Comment.hasMany(CommentReply, {
      foreignKey: 'commentId',
      as: 'replies',
    });
  };
  return Comment;
};
