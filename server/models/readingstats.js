export default (sequelize, DataTypes) => {
  const ReadingStats = sequelize.define('ReadingStats', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    articleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {});
  ReadingStats.associate = (models) => {
    const { User, Article } = models;
    ReadingStats.belongsTo(User, {
      foreignKey: 'userId'
    });
    ReadingStats.belongsTo(Article, {
      foreignKey: 'articleId'
    });
  };
  return ReadingStats;
};
