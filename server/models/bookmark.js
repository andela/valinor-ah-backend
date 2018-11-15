export default (sequelize) => {
  const Bookmark = sequelize.define('Bookmark', {
  }, {});
  Bookmark.associate = (models) => {
    // associations can be defined here
    const { User, Article } = models;
    Bookmark.belongsTo(User, {
      foreignKey: 'userId',
      as: 'myBookmarks',
      onDelete: 'CASCADE'
    });
    Bookmark.belongsTo(Article, {
      foreignKey: 'articleId',
      as: 'bookmarkedArticles',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
