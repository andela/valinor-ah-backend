export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    articleId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  ArticleTag.associate = (models) => {
    const { Article, Tag } = models;
    ArticleTag.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    ArticleTag.belongsTo(Tag, {
      foreignKey: 'tagId',
      onDelete: 'CASCADE'
    });
  };
  return ArticleTag;
};
