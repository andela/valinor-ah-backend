import chai from 'chai';
import models from '../../../server/models';
import {
  firstFollowMockData,
  secondFollowMockData,
  thirdFollowMockData,
}
  from '../../../mockdata/followMockData';

const { Follow } = models;
chai.should();

describe('Testing follow models - unit tests', () => {
  it(
    'user with id two can follow an author with id one',
    (done) => {
      Follow.create(firstFollowMockData)
        .then((followInformation) => {
          followInformation.authorId.should.be.eql(1);
          followInformation.followerId.should.be.eql(2);
        });
      done();
    }
  );
  it(
    'user with id three can follow an author with id one',
    (done) => {
      Follow.create(secondFollowMockData)
        .then((followInformation) => {
          followInformation.authorId.should.be.eql(1);
          followInformation.followerId.should.be.eql(3);
        });
      done();
    }
  );
  it(
    'author with id one should now have two followers',
    (done) => {
      Follow.findAndCountAll({ where: { authorId: 1 } })
        .then((followInformation) => {
          followInformation.count.should.be.deep.eql(2);
        });
      done();
    }
  );
  it(
    'should throw violation error if non existent user follows author',
    (done) => {
      Follow.create(thirdFollowMockData)
        .catch((error) => {
          error.name.should.be.eql('SequelizeForeignKeyConstraintError');
          error.parent.detail.should.be
            .eql('Key (followerId)=(90000) is not present in table "Users".');
        });
      done();
    }
  );
});
