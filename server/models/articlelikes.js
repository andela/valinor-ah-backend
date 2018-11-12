export default (sequelize, DataTypes) => {
  const ArticleLike = sequelize.define('ArticleLike', {
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {});
  ArticleLike.associate = (models) => {
    // associations can be defined here
    const { Article, User } = models;
    ArticleLike.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    ArticleLike.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return ArticleLike;
};
