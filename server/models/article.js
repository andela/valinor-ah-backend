export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    body: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  });
  Article.associate = (models) => {
    const { User, ArticleLike, Comment } = models;
    Article.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Article.hasMany(ArticleLike, {
      foreignKey: 'articleId'
    });
    Article.hasMany(Comment, {
      foreignKey: 'commentId',
    });
  };
  return Article;
};
