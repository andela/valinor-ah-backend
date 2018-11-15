import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../app';
import { createToken } from '../../../server/middlewares/tokenUtils';

import {
  validReportData,
  invalidReportDataTitle,
  invalidReportDataDescription
} from '../../../mockdata/reportMockData';

chai.use(chaiHttp);

describe('Report Controller Tests', () => {
  const token = createToken(1, '1d');
  describe('GET /api/v1/reports', () => {
    it('should return error if token is missing', (done) => {
      chai.request(app)
        .get('/api/v1/reports')
        .send(validReportData)
        .end((err, res) => {
          res.status.should.be.equal(401);
          res.body.status.should.be.eql('unauthorized');
          res.body.message.should.be.eql('please provide a token');
          done();
        });
    });

    it('should get all reports', (done) => {
      chai.request(app)
        .get('/api/v1/reports')
        .set('Authorization', token)
        .end((err, res) => {
          res.status.should.be.equal(200);
          res.body.status.should.eql('success');
          res.body.message.should.eql('reports retrieved successfully');
          done();
        });
    });
  });

  describe('POST /api/v1/report-types', () => {
    it('should not return error if token is missing', (done) => {
      chai.request(app)
        .get('/api/v1/reports')
        .send(validReportData)
        .end((err, res) => {
          res.status.should.be.equal(401);
          done();
        });
    });

    it('should not add a report if title is missing', (done) => {
      chai.request(app)
        .post('/api/v1/report-types')
        .set('Authorization', token)
        .send(invalidReportDataTitle)
        .end((err, res) => {
          res.status.should.be.equal(422);
          res.body.errors.title[0].should.eql('please enter a title');
          done();
        });
    });

    it('should not add a report if description is missing', (done) => {
      chai.request(app)
        .post('/api/v1/report-types')
        .set('Authorization', token)
        .send(invalidReportDataDescription)
        .end((err, res) => {
          res.status.should.be.equal(422);
          res.body.errors.description[0].should
            .eql('please enter a description');
          done();
        });
    });

    it('should not add a reportif description is missing', (done) => {
      chai.request(app)
        .post('/api/v1/report-types')
        .set('Authorization', token)
        .send(validReportData)
        .end((err, res) => {
          res.status.should.be.equal(200);
          res.body.status.should.eql('success');
          done();
        });
    });
  });
});
