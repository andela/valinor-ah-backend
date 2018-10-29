export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    avatarUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    bio: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    confirmEmail: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};