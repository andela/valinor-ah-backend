
export default {
  up: queryInterface => queryInterface.bulkInsert('ArticleLikes', [{
    status: true,
    userId: 1,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: true,
    userId: 2,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'true',
    userId: 1,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'true',
    userId: 1,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'true',
    userId: 1,
    articleId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'true',
    userId: 1,
    articleId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'true',
    userId: 1,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'true',
    userId: 1,
    articleId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'false',
    userId: 1,
    articleId: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'false',
    userId: 1,
    articleId: 9,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'false',
    userId: 1,
    articleId: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'false',
    userId: 1,
    articleId: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    status: 'false',
    userId: 1,
    articleId: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('ArticleLikes', null, {})
};
