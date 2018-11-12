export default (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: false
  });
  CommentLike.associate = (models) => {
    const { Comment, User } = models;
    CommentLike.belongsTo(Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    CommentLike.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return CommentLike;
};
