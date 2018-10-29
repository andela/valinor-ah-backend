import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../../../app';

chai.should();

chai.use(chaiHttp);
const signupUrl = '/api/v1/users/signup';
const loginUrl = '/api/v1/users/login';

describe('Test default route', () => {
  it('Should return 200 for the default route', (done) => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Undefined Routes Should Return 404', (done) => {
    chai.request(app)
      .post('/another/undefined/route')
      .send({
        random: 'random',
      })
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});

describe('/users/signup', () => {
  it('should create new user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        fullName: 'Solomon Kingsley',
        email: 'solomon.sulaiman@andela.com',
        password: 'solomon123',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.user.token.should.be.a('string');
        res.body.user.fullName.should.be.a('string');
        res.body.user.email.should.be.a('string');
        res.body.user.fullName.should.be.eql('Solomon Kingsley');
        res.body.user.confirmEmail.should.be.eql(false);
        res.body.user.email.should.be.eql('solomon.sulaiman@andela.com');
        done();
      });
  });
});

describe('Testing Login feature -Integration testing', () => {
  it(
    'should display error message if user logs in with empty fields',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: '',
          password: ''
        })
        .end((err, res) => {
          res.status.should.be.eql(422);
          res.body.should.be.eql({
            errors: {
              email: ['please enter email'],
              password: ['please enter password']
            }
          });
        });
      done();
    }
  );

  it(
    'should display error message if user fails to enter password',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'augustineezinwa@gmail.com',
          password: ''
        })
        .end((err, res) => {
          res.status.should.be.eql(422);
          res.body.should.be.eql({
            errors: {
              password: ['please enter password']
            }
          });
        });
      done();
    }
  );

  it(
    'should display error message if user logs in with invalid credentials',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'augustineezinwa@gmail.com',
          password: 'fishdonek4'
        })
        .end((err, res) => {
          res.status.should.be.eql(401);
          res.body.should.be.eql({
            errors: {
              message: ['Invalid email or password']
            }
          });
        });
      done();
    }
  );

  it(
    'should log in a user',
    (done) => {
      chai.request(app)
        .post(loginUrl)
        .send({
          email: 'solomon.sulaiman@andela.com',
          password: 'solomon123'
        })
        .end((err, res) => {
          res.status.should.be.eql(200);
          res.body.status.should.be.eql('success');
          res.body.message.should.be.eql('you are logged in');
          res.body.user.email.should.be.eql('solomon.sulaiman@andela.com');
          res.body.user.token.should.be.a('string');
        });
      done();
    }
  );
});
