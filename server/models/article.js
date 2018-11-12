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
    },
    rating: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: null
    }
  });

  Article.associate = (models) => {
    const {
      User, ArticleLike, Comment, Rating, Category, ArticleTag
    } = models;
    Article.belongsTo(User, {
      as: 'author',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Article.belongsTo(Category, {
      as: 'category',
      foreignKey: 'categoryId'
    });
    Article.hasMany(ArticleLike, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Article.hasMany(Rating, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Article.hasMany(Comment, {
      foreignKey: 'commentId',
    });
    Article.hasMany(ArticleTag, {
      foreignKey: 'articleId',
    });
  };

  return Article;
};
