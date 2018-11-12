export default {
  up: queryInterface => queryInterface.bulkInsert('CategoryFollows', [{
    categoryId: 1,
    followerId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    categoryId: 2,
    followerId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    categoryId: 3,
    followerId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('CategoryFollows', null, {})
};
