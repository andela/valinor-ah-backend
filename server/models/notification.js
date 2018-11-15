export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Notification.associate = (models) => {
    const { NotificationEvent } = models;

    Notification.hasMany(NotificationEvent, {
      foreignKey: 'notificationId'
    });
  };
  return Notification;
};
