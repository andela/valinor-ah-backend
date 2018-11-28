export default {
  up: queryInterface => queryInterface.bulkInsert('Comments', [{
    body: 'This actually sucks',
    userId: 1,
    articleId: 1,
    inlineComment: 'When are you coming to lagos?',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    body: 'This actually good',
    userId: 1,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    body: 'This actually good',
    userId: 1,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    body: 'This actually isnt bad',
    userId: 2,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    body: 'This isnt too bad',
    userId: 1,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    body: 'This comment belongs to the delete comments tests',
    userId: 4,
    articleId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
