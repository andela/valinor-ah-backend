export default {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    fullName: 'John Doe',
    email: 'johndoe@andela.com',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    fullName: 'John Mike',
    email: 'johnmike@andela.com',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    fullName: 'John Confirm',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    confirmEmail: true,
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
