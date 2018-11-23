import getRoleId from '../../../server/helpers/getRoleId';

describe('Unit tests on getRoleId', () => {
  let firstRoleId, secondRoleId;
  it('roleId of user with id 2 should be 3', () => {
    (async () => {
      firstRoleId = await getRoleId(1);
      firstRoleId.should.be.eql(2);
    })();
  });
  it('roleId of user with id 5 should be 1', () => {
    (async () => {
      secondRoleId = await getRoleId(5);
      secondRoleId.should.be.eql(1);
    })();
  });
});
