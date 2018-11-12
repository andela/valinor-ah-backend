export default {
  up: (queryInterface) => {
    queryInterface.bulkInsert('CommentLikes', [{
      status: true,
      commentId: 4,
      userId: 1
    }, {
      status: true,
      commentId: 1,
      userId: 2
    }, {
      status: true,
      commentId: 1,
      userId: 1
    }], {});
  },
  down: (queryInterface) => {
    queryInterface.bulkDelete('CommentLikes', null, {});
  }
};
