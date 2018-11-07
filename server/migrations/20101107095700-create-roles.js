export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    roleName: {
      allowNull: false,
      type: Sequelize.STRING
    },
    privilege: {
      allowNull: false,
      type: Sequelize.STRING
    }
  }),
  down: queryInterface => queryInterface.dropTable('Roles')
};
