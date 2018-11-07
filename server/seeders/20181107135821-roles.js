/* eslint-disable no-unused-vars */
export default {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Roles', [{
      roleName: 'Admin',

      privilege: 'Can delete users, mediate conflicts and review reports.',
    }, {
      roleName: 'Author',

      privilege: 'Is a verified author and can be followed.',
    }, {
      roleName:
      'User',

      privilege:
      'Can follow authors and publish articles, but can not be followed',
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
  }
};
