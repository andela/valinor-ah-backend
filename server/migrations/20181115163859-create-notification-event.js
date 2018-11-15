export default {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('NotificationEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      notificationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Notifications',
          key: 'id'
        }
      },
      receiverId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      senderId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      body: {
        allowNull: false,
        type: Sequelize.STRING
      },
      url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
  down: queryInterface => queryInterface.dropTable('NotificationEvents')
};
