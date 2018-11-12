
export default {
  up: queryInterface => queryInterface.bulkInsert('ArticleLikes', [{
    status: 'false',
    userId: 1,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'true',
    userId: 1,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('ArticleLikes', null, {})
};
