export default {
  up: queryInterface => queryInterface.bulkInsert('Tags', [{
    tagName: 'football',
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    tagName: 'basketball',
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    tagName: 'hockey',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),
  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
