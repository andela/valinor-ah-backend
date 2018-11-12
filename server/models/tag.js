export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    tagName: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });
  Tag.associate = (models) => {
    const { ArticleTag } = models;
    Tag.hasMany(ArticleTag, {
      foreignKey: 'tagId'
    });
  };
  return Tag;
};
