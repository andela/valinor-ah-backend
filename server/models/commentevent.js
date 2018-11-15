export default (sequelize, DataTypes) => {
  const CommentEvent = sequelize.define('CommentEvent', {
    previousBody: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {});
  CommentEvent.associate = (models) => {
    const { Comment } = models;
    CommentEvent.belongsTo(Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentEvent;
};
