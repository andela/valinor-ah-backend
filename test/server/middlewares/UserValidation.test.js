import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../app';
import {
  userDataWithEmptyEmail,
  userDataWithEmptyName,
  userDataWithEmptyFields,
  userDataWithEmptyPassword,
  userDataWithInvalidEmail,
  userDataWithInvalidFields,
  userDataWithInvalidName,
  userDataWithInvalidPassword,
  userDataWithInvalidPasswordAndEmail,
  userDataWithLongName,
  userDataWithNoLastName,
  userDataWithNumericName,
  userDataWithShortPassword,
  userDataWithInvalidDataTypes,
  userDataWithThreeNames,
  userDataWithAnExistingEmail,
  userDataWithWhiteSpacedPassword,
} from '../../../mockdata/userMockData';

chai.use(chaiHttp);
chai.should();

const signupUrl = '/api/v1/users/signup';

describe('User signup validation unit tests', () => {
  it('should return error if user enters empty name', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithEmptyName)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'Invalid full name',
              'please enter first name and last name separated by space'
            ]
          }
        });
        done();
      });
  });
  it(
    'should return error if user enters invalid name (have numbers)',
    (done) => {
      chai.request(app)
        .post(signupUrl)
        .send(userDataWithNumericName)
        .end((err, res) => {
          res.body.should.be.eql({
            errors: {
              fullName: [
                'Invalid full name',
                'please enter first name and last name separated by space'
              ]
            }
          });
          done();
        });
    }
  );
  it('should return error if user enters invalid name (have &%#)', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithInvalidName)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'Invalid full name',
              'please enter first name and last name separated by space'
            ]
          }
        });
        done();
      });
  });
  it('should return error if user enters a name that is too long', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithLongName)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'full name is too long'
            ]
          }
        });
        done();
      });
  });
  it('should return error if user enters only first name', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithNoLastName)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'Invalid full name',
              'please enter first name and last name separated by space'
            ]
          }
        });
        done();
      });
  });
  it('should return error if user enters invalid password', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithInvalidPassword)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            password: [
              'password must contain a letter and number'
            ]
          }
        });
        done();
      });
  });
  it(
    'should return error if user enters a password length less than 8',
    (done) => {
      chai.request(app)
        .post(signupUrl)
        .send(userDataWithShortPassword)
        .end((err, res) => {
          res.body.should.be.eql({
            errors: {
              password: [
                'password must be at least 8 characters'
              ]
            }
          });
          done();
        });
    }
  );
  it('should return error if user doesnt enter password', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithEmptyPassword)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            password: [
              'password must be at least 8 characters',
              'password must contain a letter and number'
            ]
          }
        });
        done();
      });
  });
  it('should return error if user enters invalid email', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithInvalidEmail)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            email: [
              'please enter a valid email'
            ]
          }
        });
        done();
      });
  });
  it('should return error if user fails to enter email', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithEmptyEmail)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            email: [
              'please enter a valid email'
            ]
          }
        });
        done();
      });
  });
  it('should return error if user enters invalid name and password', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithInvalidPasswordAndEmail)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            email: [
              'please enter a valid email',
            ],
            password: [
              'password must contain a letter and number'
            ]
          }
        });
        done();
      });
  });
  it('should return error if user enters invalid fields', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithInvalidFields)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'Invalid full name',
              'please enter first name and last name separated by space',
            ],
            email: [
              'please enter a valid email',
            ],
            password: [
              'password must contain a letter and number',
            ]
          }
        });
        done();
      });
  });
  it('should return error if user fails to fill any field', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithEmptyFields)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'Invalid full name',
              'please enter first name and last name separated by space',
            ],
            email: [
              'please enter a valid email',
            ],
            password: [
              'password must be at least 8 characters',
              'password must contain a letter and number',
            ]
          }
        });
        done();
      });
  });
  it('should return error if user enters more than three names', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithThreeNames)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'You entered more than two names',
            ]
          }
        });
        done();
      });
  });
  it('should return error if any field is not of type string', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDataWithInvalidDataTypes)
      .end((err, res) => {
        res.body.should.be.eql({
          errors: {
            fullName: [
              'Invalid full name',
              'please enter first name and last name separated by space',
            ],
            email: [
              'please enter a valid email',
            ],
            password: [
              'password must be at least 8 characters',
              'password must contain a letter and number',
            ]
          }
        });
        done();
      });
  });
  it(
    'should return error if password contains white space',
    (done) => {
      chai.request(app)
        .post(signupUrl)
        .send(userDataWithWhiteSpacedPassword)
        .end((err, res) => {
          res.body.should.be.eql({
            errors: {
              password: ['password must not contain space']
            }
          });
          done();
        });
    }
  );
  it(
    'should return error if user enters an existing email',
    (done) => {
      chai.request(app)
        .post(signupUrl)
        .send(userDataWithAnExistingEmail)
        .end((err, res) => {
          res.body.should.be.eql({
            errors: {
              email: [
                'email is already in use',
              ]
            }
          });
          done();
        });
    }
  );
});
