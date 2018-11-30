export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    fullName: {
      allowNull: true,
      type: Sequelize.STRING
    },
    roleId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 3,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    following: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    followers: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    email: {
      allowNull: true,
      type: Sequelize.STRING
    },
    avatarUrl: {
      allowNull: true,
      type: Sequelize.STRING
    },
    facebookId: {
      allowNull: true,
      type: Sequelize.BIGINT,
    },
    twitterId: {
      allowNull: true,
      type: Sequelize.BIGINT,
    },
    googleId: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    bio: {
      allowNull: true,
      type: Sequelize.STRING
    },
    notification: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    confirmEmail: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'active'
    },
    articlesRead: {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    twitterUrl: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    facebookUrl: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    location: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};
