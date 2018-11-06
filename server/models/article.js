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
    const { User } = models;
    Article.belongsTo(User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Article;
};
