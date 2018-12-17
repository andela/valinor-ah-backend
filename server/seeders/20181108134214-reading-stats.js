
export default {
  up: queryInterface => queryInterface.bulkInsert('ReadingStats', [{
    userId: 1,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 3,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 4,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 5,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 1,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 3,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 4,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 5,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 1,
    articleId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    articleId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 3,
    articleId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 4,
    articleId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 5,
    articleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 1,
    articleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 2,
    articleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 3,
    articleId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 4,
    articleId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 5,
    articleId: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('ReadingStats', null, {})
};
