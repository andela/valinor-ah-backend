export default {
  up: queryInterface => queryInterface.bulkInsert('Articles', [{
    title: 'Amala',
    slug: 'amala-efo-riro',
    description: 'Amala is a food',
    body: 'Amala is a yoruba food',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Jambolani',
    slug: 'south-africa-201',
    description: 'Jambolani is the fifa ball',
    body: 'Jambolani is the fifa ball used in south africa 2010 world cup',
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Valinor',
    slug: 'team-valinor',
    description: 'Team valinor is a simulation team',
    body: 'They are handling authors haven product. Good luck, guys.',
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
