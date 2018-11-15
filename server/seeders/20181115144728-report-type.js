export default {
  up: queryInterface => queryInterface.bulkInsert('ReportTypes', [{
    title: 'Plagiarism',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'User Agreement',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Policy',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('ReportTypes', null, {})
};
