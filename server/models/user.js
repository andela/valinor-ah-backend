export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      allowNull: true,
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
      type: DataTypes.BIGINT,
    },
    twitterId: {
      allowNull: true,
      type: DataTypes.BIGINT,
    },
    googleId: {
      allowNull: true,
      type: DataTypes.BIGINT,
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
    const {
      Article,
      ArticleLike,
      Role,
      Comment,
      Rating,
      CommentLike
    } = models;

    User.belongsTo(Role, {
      foreignKey: 'roleId'
    });

    User.hasMany(Article, {
      foreignKey: 'userId'
    });

    User.hasMany(Rating, {
      foreignKey: 'userId'
    });

    User.hasMany(ArticleLike, {
      foreignKey: 'userId'
    });

    User.hasMany(Comment, {
      foreignKey: 'userId'
    });
    User.hasMany(CommentLike, {
      foreignKey: 'userId'
    });
  };

  return User;
};
