export default {
  up: queryInterface => queryInterface.bulkInsert('Categories', [{
    categoryName: 'sports',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    categoryName: 'technology',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    categoryName: 'fashion',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
