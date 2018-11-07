import chai from 'chai';
import models from '../../../server/models';

const { Role } = models;
chai.should();
describe('Ensure roles table is created and populated', () => {
  it('should return all rows in the table', () => {
    Role
      .findAll()
      .then((result) => {
        result[0].dataValues.should.deep
          .equal({
            id: 1,
            roleName: 'Admin',
            privilege: 'Can delete users, mediate conflicts and review reports.'
          });
        result[1].dataValues.should.deep
          .equal({
            id: 2,
            roleName: 'Author',
            privilege: 'Is a verified author and can be followed.'
          });
        result[2].dataValues.should.deep
          .equal({
            id: 3,
            roleName: 'User',
            privilege:
            'Can follow authors and publish articles, but can not be followed'
          });
      })
      .catch(error => error);
  });
});
