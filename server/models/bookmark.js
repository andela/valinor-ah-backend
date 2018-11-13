export default (sequelize) => {
  const Bookmark = sequelize.define('Bookmark', {
  }, {});
  Bookmark.associate = (models) => {
    // associations can be defined here
    const { User, Article } = models;
    Bookmark.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Bookmark.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
