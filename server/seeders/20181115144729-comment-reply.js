export default {
  up: queryInterface => queryInterface.bulkInsert('CommentReplies', [{
    reply: 'Plagiarism is bad',
    userId: 1,
    commentId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reply: 'User Agreement is bad',
    userId: 1,
    commentId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reply: 'Policy is bad',
    userId: 1,
    commentId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reply: 'Policy is bad',
    userId: 1,
    commentId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('CommentReplies', null)
};
