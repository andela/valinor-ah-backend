export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    rating: {
      allowNull: true,
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: 'Article rating cannot be less than 0'
        },
        max: {
          args: [5],
          msg: 'Article rating cannot be greater than 5'
        }
      }
    }
  }, {
    hooks: {
      afterCreate: (model) => {
        const id = model.articleId;
        sequelize.models.Article.findAll({
          where: { id },
          // eslint-disable-next-line max-len
          attributes: ['id', [sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'avg_ratings']],
          include: [{
            model: sequelize.models.Rating,
            attributes: []
          }],
          group: ['Article.id'],
          raw: true
        })
          .then((result) => {
            const avg = Number(result[0].avg_ratings).toFixed(2);
            // eslint-disable-next-line max-len
            sequelize.models.Article.update({ rating: avg }, { where: { id } });
          });
      }
    }
  });

  Rating.associate = (models) => {
    const { User, Article } = models;

    Rating.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Rating.belongsTo(Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Rating;
};
