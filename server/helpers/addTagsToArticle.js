import models from '../models';

const { ArticleTag, Tag } = models;

const addTagsToArticle = (tags, articleId) => {
  if (tags.length === 0) {
    return null;
  }
  // loop through tags and find/create tags and add to articleTags table
  tags.forEach(async (tagName) => {
    let tagData;
    try {
      // find or add entry to tag table
      [tagData] = await Tag.findOrCreate({
        where: { tagName },
        defaults: { tagName }
      });
      // add entry to article tag table
      await ArticleTag.create({
        tagId: tagData.id,
        articleId,
      });
      return null;
    } catch (err) {
      return err;
    }
  });
};

export default addTagsToArticle;
