export default {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    fullName: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    fullName: 'John Mike',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
