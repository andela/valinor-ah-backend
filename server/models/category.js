export default (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    categoryName: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  });
  Category.associate = (models) => {
    const { Article } = models;
    Category.hasMany(Article, {
      foreignKey: 'categoryId'
    });
  };
  return Category;
};
