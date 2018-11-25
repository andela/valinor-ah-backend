export default (sequelize, DataTypes) => {
  const CommentReply = sequelize.define('CommentReply', {
    reply: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  CommentReply.associate = (models) => {
    const { User, Comment } = models;
    CommentReply.belongsTo(User, {
      foreignKey: 'userId',
      as: 'commenter',
      onDelete: 'CASCADE'
    });
    CommentReply.belongsTo(Comment, {
      foreignKey: 'commentId',
      as: 'replies',
      onDelete: 'CASCADE'
    });
  };
  return CommentReply;
};
