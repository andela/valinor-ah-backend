export default {
  up: queryInterface => queryInterface.bulkInsert('Ratings', [{
    rating: 5,
    userId: 1,
    articleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Ratings', null, {})
};
