export default {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    fullName: 'John Doe',
    email: 'johndoe@andela.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    fullName: 'John Mike',
    email: 'johnmike@andela.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    fullName: 'John Confirm',
    createdAt: new Date(),
    updatedAt: new Date(),
    confirmEmail: true,
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
