import httpMocks from 'node-mocks-http';
import chai from 'chai';
import validateAccess from '../../../server/middlewares/validateAccess';

const should = chai.should();


describe('Unit tests on verify admin middleware', () => {
  it('should throw error if a user wants to perform admin operations',
    async () => {
      const req = {
        userData: {
          id: 5
        },
        articleData: {
          userId: 1
        }
      };
      let a;
      const next = () => {
        a = 1;
      };
      const res = httpMocks.createResponse();
      await validateAccess(['ADMIN'])(req, res, next);
      res.statusCode.should.be.eql(403);
      res.statusMessage.should.be.eql('OK');
      should.equal(a, undefined);
    });
  it('should allow admin to perform admin related operations', async () => {
    const req = {
      userData: {
        id: 3
      },
      articleData: {
        userId: 8
      },
      commentData: {
        userId: 8
      },
      resourceUserData: {
        userId: 8
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['ADMIN'])(req, res, next);
    res.statusCode.should.be.eql(200);
    res.statusMessage.should.be.eql('OK');
    a.should.be.eql(1);
  });
  it(`user should able to perform an operation that on an article
   belongs to him or her`,
  async () => {
    const req = {
      userData: {
        id: 4
      },
      articleData: {
        userId: 4
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['ADMIN', 'USER', 'AUTHOR'])(req, res, next);
    res.statusCode.should.be.eql(200);
    res.statusMessage.should.be.eql('OK');
    a.should.be.eql(1);
  });
  it(`should throw error if user wants to perform 
  operation on an article from another user`,
  async () => {
    const req = {
      userData: {
        id: 6
      },
      articleData: {
        userId: 4
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['USER', 'ADMIN', 'AUTHOR'])(req, res, next);
    res.statusCode.should.be.eql(403);
    res.statusMessage.should.be.eql('OK');
    should.equal(a, undefined);
  });
  it(`should throw error if user wants to perform 
  operation on a comment from another user`,
  async () => {
    const req = {
      userData: {
        id: 6
      },
      commentData: {
        userId: 4
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['USER', 'ADMIN', 'AUTHOR'])(req, res, next);
    res.statusCode.should.be.eql(403);
    res.statusMessage.should.be.eql('OK');
    should.equal(a, undefined);
  });
  it(`should allow user to perform 
  operation on his or her comment`,
  async () => {
    const req = {
      userData: {
        id: 6
      },
      commentData: {
        userId: 4
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['USER', 'ADMIN', 'AUTHOR'])(req, res, next);
    res.statusCode.should.be.eql(403);
    res.statusMessage.should.be.eql('OK');
    should.equal(a, undefined);
  });
  it(`should throw error if user wants to perform 
  operation on a user resource from another user`,
  async () => {
    const req = {
      userData: {
        id: 6
      },
      resourceUserData: {
        userId: 4
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['USER', 'ADMIN', 'AUTHOR'])(req, res, next);
    res.statusCode.should.be.eql(403);
    res.statusMessage.should.be.eql('OK');
    should.equal(a, undefined);
  });
  it(`author should able to perform an operation on an article that
  belongs to him or her`,
  async () => {
    const req = {
      userData: {
        id: 1
      },
      articleData: {
        userId: 1
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['AUTHOR'])(req, res, next);
    res.statusCode.should.be.eql(200);
    res.statusMessage.should.be.eql('OK');
    a.should.be.eql(1);
  });
  it(`author should able to perform an operation o
   his or profile resource`,
  async () => {
    const req = {
      userData: {
        id: 1
      },
      resourceUserData: {
        id: 1
      }
    };
    let a;
    const next = () => {
      a = 1;
    };
    const res = httpMocks.createResponse();
    await validateAccess(['AUTHOR'])(req, res, next);
    res.statusCode.should.be.eql(200);
    res.statusMessage.should.be.eql('OK');
    a.should.be.eql(1);
  });
});
