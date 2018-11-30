export default {
  up: queryInterface => queryInterface.bulkInsert('NotificationEvents', [{
    notificationId: 1,
    receiverId: 1,
    senderId: 2,
    body: 'You have a new follower',
    url: 'https://authorshaven.com/follower1',
    status: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    notificationId: 2,
    receiverId: 2,
    senderId: 3,
    body: 'You have a new comment reaction',
    url: 'https://authorshaven.com/article54',
    status: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    notificationId: 3,
    receiverId: 3,
    senderId: 1,
    body: 'You have a new article post',
    url: 'https://authorshaven.com/article14',
    status: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    notificationId: 1,
    receiverId: 2,
    senderId: 1,
    body: 'You have a new follower',
    url: 'https://authorshaven.com/follower23',
    status: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down:
    queryInterface => queryInterface.bulkDelete('NotificationEvents', null, {})
};
