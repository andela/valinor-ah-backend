export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    fullName: {
      allowNull: false,
      type: Sequelize.STRING
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
      type: Sequelize.STRING,
    },
    twitterId: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    googleId: {
      allowNull: true,
      type: Sequelize.STRING,
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
