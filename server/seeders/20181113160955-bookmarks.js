

export default {
  up: queryInterface => queryInterface.bulkInsert('Bookmarks', [{
    userId: 1,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 1,
    articleId: 18,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    articleId: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 3,
    articleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    articleId: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 3,
    articleId: 13,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Bookmarks', null, {})
};
