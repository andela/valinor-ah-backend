import chai from 'chai';
import models from '../../../server/models';

chai.should();

const { NotificationEvent } = models;

describe('Testing NotificationEvent model', () => {
  it('get an event from NotificationEvents table', (done) => {
    NotificationEvent.findByPk(1)
      .then((event) => {
        event.should.be.a('object');
        event.notificationId.should.be.a('number');
        event.senderId.should.be.a('number');
        event.receiverId.should.be.a('number');
        done();
      });
  });
  it('get all notification event for user 3', (done) => {
    NotificationEvent
      .findAndCountAll({
        where: {
          receiverId: 3
        }
      })
      .then((events) => {
        events.count.should.be.eql(1);
        done();
      });
  });
  it('get all notification event for user 1', (done) => {
    NotificationEvent
      .findAndCountAll({
        where: {
          receiverId: 1
        }
      })
      .then((events) => {
        events.count.should.be.eql(3);
        done();
      });
  });
  it('add a new event to NotificationEvent', (done) => {
    NotificationEvent.create({
      notificationId: 3,
      receiverId: 2,
      senderId: 1,
      body: 'You have a new article post',
      url: 'https://authorshaven.com/article14',
      status: false,
    })
      .then((event) => {
        event.should.be.a('object');
        event.should.have.property('receiverId');
        event.should.have.property('senderId');
        event.should.have.property('body');
        event.should.have.property('url');
        event.should.have.property('notificationId');
        event.should.have.property('status');
        done();
      });
  });
  it('get all notification event for user 2', (done) => {
    NotificationEvent
      .findAndCountAll({
        where: {
          receiverId: 2
        }
      })
      .then((events) => {
        events.count.should.be.eql(7);
        done();
      });
  });
});
