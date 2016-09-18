const assert = require('assert');
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/user')
  .use('../../modules/topic')
  .use('../../modules/message')

const mockUser = require('../mock/mock-user')(seneca)
const mockTopic = require('../mock/mock-topic')(seneca)
const mockMessages = require('../mock/mock-message')(seneca)

before((done) => {
  mockUser.it().then(() => {
    mockTopic.it().then(() => {
      mockMessages.it().then(() => {
        done()
      })
    })
  })
});

describe('When an user tries to delete a topic', () => {
  describe('And the topic is not from himself', () => {
    it('should return an exception', (done) => {

      seneca.act('role:topic,cmd:del', {
        id: '1',
        id_user: 'she'
      }, (err, topic) => {

        if (err)
          return done()

        done(new Error('Did not return an error'))
      })
    })
  })
  describe('And the topic is from himself', () => {
    it('should delete the topic', (done) => {

      seneca.act('role:topic,cmd:del', {
        id: '3',
        id_user: 'he'
      }, (err, topic) => {

        if (err)
          return done(err)

        done()
      })
    })
  })
})

describe('When an adm tries to delete a topic', () => {
  it('should delete the topic', (done) => {

    seneca.act('role:topic,cmd:del', {
      id: '2',
      id_user: 'me'
    }, (err, topic) => {

      if (err)
        return done(err)

      done()
    })
  })
})

describe('When an user tries to delete a message', () => {
  describe('And the message is not from himself', () => {
    it('should return an exception', (done) => {

      seneca.act('role:message,cmd:del', {
        id: '1',
        id_user: 'she'
      }, (err, message) => {

        if (err)
          return done()

        done(new Error('Did not return an error'))
      })
    })
  })
  describe('And the message is from himself', () => {
    it('should delete the message', (done) => {

      seneca.act('role:message,cmd:del', {
        id: '3',
        id_user: 'he'
      }, (err, message) => {

        if (err)
          return done(err)

        done()
      })
    })
  })
})

describe('When an adm tries to delete a message', () => {
  it('should delete the message', (done) => {

    seneca.act('role:message,cmd:del', {
      id: '2',
      id_user: 'me'
    }, (err, message) => {

      if (err)
        return done(err)

      done()
    })
  })
})
