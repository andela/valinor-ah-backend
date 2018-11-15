export default {
  up: queryInterface => queryInterface.bulkInsert('Articles', [
    {
      title: 'My story at the beach',
      slug: 'My-story-at-the-beach-2324232323',
      description: 'This is my story at the beach',
      body: 'Once upon a time in Mexico.. there was ...',
      userId: 1,
      readTime: 3600,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Jambolani',
      slug: 'south-africa-201',
      description: 'Jambolani is the fifa ball',
      body: 'Jambolani is the fifa ball used in south africa 2010 world cup',
      userId: 2,
      readTime: 3600,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Valinor',
      slug: 'team-valinor',
      description: 'Team valinor is a simulation team',
      body: 'They are handling authors haven product. Good luck, guys.',
      userId: 2,
      readTime: 3600,
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'My story at the beach',
      slug: 'My-story-at-the-beach-2324232323a',
      description: 'This is my story at the beach',
      body: 'Once upon a time in Mexico.. there was ...',
      userId: 1,
      readTime: 3600,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Jambolani',
      slug: 'south-africa-201a',
      description: 'Jambolani is the fifa ball',
      body: 'Jambolani is the fifa ball used in south africa 2010 world cup',
      userId: 2,
      readTime: 3600,
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Valinor',
      slug: 'team-valinora',
      description: 'Team valinor is a simulation team',
      body: 'They are handling authors haven product. Good luck, guys.',
      userId: 2,
      readTime: 3600,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'My story at the beach',
      slug: 'My-story-at-the-beach-2324232323b',
      description: 'This is my story at the beach',
      body: 'Once upon a time in Mexico.. there was ...',
      userId: 1,
      readTime: 3600,
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Jambolani',
      slug: 'south-africa-201b',
      description: 'Jambolani is the fifa ball',
      body: 'Jambolani is the fifa ball used in south africa 2010 world cup',
      userId: 2,
      readTime: 3600,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Valinor',
      slug: 'team-valinorb',
      description: 'Team valinor is a simulation team',
      body: 'They are handling authors haven product. Good luck, guys.',
      userId: 2,
      readTime: 3600,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'My story at the beach',
      slug: 'My-story-at-the-beach-2324232323c',
      description: 'This is my story at the beach',
      body: 'Once upon a time in Mexico.. there was ...',
      userId: 1,
      readTime: 3600,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Jambolani',
      slug: 'south-africa-201c',
      description: 'Jambolani is the fifa ball',
      body: 'Jambolani is the fifa ball used in south africa 2010 world cup',
      userId: 2,
      readTime: 3600,
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Valinor',
      slug: 'team-valinorc',
      description: 'Team valinor is a simulation team',
      body: 'They are handling authors haven product. Good luck, guys.',
      userId: 2,
      readTime: 3600,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'My story at the beach',
      slug: 'My-story-at-the-beach-2324232323d',
      description: 'This is my story at the beach',
      body: 'Once upon a time in Mexico.. there was ...',
      userId: 1,
      readTime: 3600,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Jambolani',
      slug: 'south-africa-201d',
      description: 'Jambolani is the fifa ball',
      body: 'Jambolani is the fifa ball used in south africa 2010 world cup',
      userId: 2,
      readTime: 3600,
      categoryId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Valinor',
      slug: 'team-valinord',
      description: 'Team valinor is a simulation team',
      body: 'They are handling authors haven product. Good luck, guys.',
      userId: 2,
      readTime: 3600,
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'My story at the beach',
      slug: 'My-story-at-the-beach-2324232323e',
      description: 'This is my story at the beach',
      body: 'Once upon a time in Mexico.. there was ...',
      userId: 1,
      readTime: 3600,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Jambolani',
      slug: 'south-africa-201e',
      description: 'Jambolani is the fifa ball',
      body: 'Jambolani is the fifa ball used in south africa 2010 world cup',
      userId: 2,
      readTime: 3600,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Valinor',
      slug: 'team-valinore',
      description: 'Team valinor is a simulation team',
      body: 'They are handling authors haven product. Good luck, guys.',
      userId: 2,
      readTime: 3600,
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
