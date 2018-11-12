export default (sequelize, DataTypes) => {
  const CategoryFollow = sequelize.define('CategoryFollow', {
    categoryId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  });
  CategoryFollow.associate = (models) => {
    const { User, Category } = models;
    CategoryFollow.belongsTo(User, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
    CategoryFollow.belongsTo(Category, {
      foreignKey: 'categoryId',
      onDelete: 'CASCADE'
    });
  };
  return CategoryFollow;
};
