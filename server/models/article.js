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
      type: DataTypes.TEXT,
    },
    readTime: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    rating: {
      allowNull: true,
      type: DataTypes.FLOAT,
      defaultValue: null
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['publish', 'draft', 'trash', 'under review'],
      defaultValue: 'draft'
    }
  }, {
    hooks: {
      afterCreate: async (article) => {
        try {
          const articles = await sequelize.models.Article.findAndCountAll({
            where: {
              userId: article.userId
            },
            include: [{
              model: sequelize.models.User,
              as: 'author'
            }]
          });
          if (articles.count >= 5 && articles.rows[0].author.roleId === 3) {
            await sequelize.models.User.update({
              roleId: 2
            },
            {
              where: {
                id: article.userId
              }
            });
          }
        } catch (err) {
          return err;
        }
      }
    }
  });

  Article.associate = (models) => {
    const {
      User,
      ArticleLike,
      Comment,
      Rating,
      Category,
      ArticleTag,
      Bookmark,
      ReadingStats,
      CommentReply
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
      as: 'comments',
      foreignKey: 'articleId',
    });
    Article.hasMany(Bookmark, {
      as: 'bookmarkedArticles',
      foreignKey: 'articleId',
    });
    Article.hasMany(ArticleTag, {
      foreignKey: 'articleId',
    });
    Article.hasMany(ReadingStats, {
      foreignKey: 'userId'
    });
    Article.hasMany(CommentReply, {
      foreignKey: 'articleId'
    });
  };
  return Article;
};
