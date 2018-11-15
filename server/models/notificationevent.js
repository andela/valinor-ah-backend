export default (sequelize, DataTypes) => {
  const NotificationEvent = sequelize.define('NotificationEvent', {
    body: {
      allowNull: false,
      type: DataTypes.STRING
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {});
  NotificationEvent.associate = (models) => {
    // associations can be defined here
    const { User, Notification } = models;
    NotificationEvent.belongsTo(User, {
      foreignKey: 'receiverId',
      onDelet: 'CASCADE'
    });
    NotificationEvent.belongsTo(User, {
      foreignKey: 'senderId',
      onDelet: 'CASCADE'
    });
    NotificationEvent.belongsTo(Notification, {
      foreignKey: 'notificationId',
      onDelete: 'CASCADE'
    });
  };
  return NotificationEvent;
};
