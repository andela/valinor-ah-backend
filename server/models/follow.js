export default (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    authorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    followerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  Follow.associate = (models) => {
    const { User } = models;
    Follow.belongsTo(User, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });
    Follow.belongsTo(User, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };
  return Follow;
};
