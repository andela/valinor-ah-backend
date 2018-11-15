export default {
  up: queryInterface => queryInterface.bulkInsert('Notifications', [{
    type: 'follower',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'comment reaction',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'new article post',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'new article like',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Notifications', null, {})
};
