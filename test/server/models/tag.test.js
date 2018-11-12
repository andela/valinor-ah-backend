import chai from 'chai';
import models from '../../../server/models';

const { Tag } = models;
chai.should();

describe('Query the category tags table using model', () => {
  let tag;
  before(async () => {
    tag = await Tag.findByPk(1);
  });

  it('should retrieve the first tag', () => {
    tag.dataValues.tagName.should.equal('football');
  });
});

describe('Create an entry', () => {
  let tag;
  let tagId;
  before(async () => {
    tag = await Tag.create({
      tagName: 'postgres'
    });
    tagId = tag.dataValues.id;
  });

  it('should return created values', () => {
    tag.dataValues.tagName.should.equal('postgres');
    tag.dataValues.id.should.equal(tagId);
  });
});
