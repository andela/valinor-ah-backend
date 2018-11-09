export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    body: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  Comment.associate = (models) => {
    // associations can be defined here
    const { Article, User } = models;
    Comment.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
