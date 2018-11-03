export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    avatarUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    facebookId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    twitterId: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    googleId: {
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
    twitterUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    facebookUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    location: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    const { Article } = models;
    User.hasMany(Article, {
      foreignKey: 'userId'
    });
  };
  return User;
};
