import models from '../models';

const { Article } = models;
export const updateStatus = (status, id) => async (res) => {
  await Article.update({
    status
  }, {
    where: {
      id
    }
  });
  return res.status(200).json({
    status: 'success',
    message: `you have ${status}ed this article`
  });
};

export const deleteArticle = id => async (res) => {
  const destroyedArticleId = await Article.destroy({
    where: { id }
  });
  if (destroyedArticleId) {
    return res.status(200).json({
      status: 'success',
      message: 'you have deleted this article'
    });
  }
};
