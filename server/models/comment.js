export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  Comment.associate = (models) => {
    // associations can be defined here
    const { Article, User, CommentLike } = models;
    Comment.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comment.hasMany(CommentLike, {
      foreignKey: 'commentId',
    });
  };
  return Comment;
};
