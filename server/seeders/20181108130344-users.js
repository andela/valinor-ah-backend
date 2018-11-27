export default {
  up: queryInterface => queryInterface.bulkInsert('Users', [{
    fullName: 'John Doe',
    email: 'johndoe@andela.com',
    roleId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    confirmEmail: false,
  },
  {
    fullName: 'John Mike',
    email: 'johnmike@andela.com',
    roleId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    confirmEmail: false,
  },
  {
    fullName: 'John Confirm',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    confirmEmail: true,
  },
  {
    fullName: 'freddie Krugger',
    email: 'freddie@example.com',
    roleId: 3,
    confirmEmail: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    fullName: 'ToBe Deleted',
    email: 'deleted@example.com',
    roleId: 3,
    confirmEmail: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
