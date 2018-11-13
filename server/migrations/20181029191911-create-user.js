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
    password: {
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
      type: Sequelize.BIGINT,
    },
    bio: {
      allowNull: true,
      type: Sequelize.STRING
    },
    confirmEmail: {
      allowNull: true,
      type: Sequelize.BOOLEAN
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
