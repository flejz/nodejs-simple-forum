const assert = require('chai').assert
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/message')

const mock = require('../mock/mock-message')(seneca)

before((done) => {
  mock.it().then(() => {
    done()
  })
})

describe('When requesting all the messages by topic', () => {
  it('should retrieve a list of all the messages ordered by date', (done) => {

    seneca.act('role:message,cmd:by_topic', {
      id_topic: '1'
    }, (err, messages) => {

      if (err)
        return done(err)

      assert.ok(typeof messages == 'object' && messages.length)
      done()
    })
  })
  it('should retrieve the main_message as first', (done) => {

    seneca.act('role:message,cmd:by_topic', {
      id_topic: '1'
    }, (err, messages) => {

      if (err)
        return done(err)

      assert.ok(messages[0].main_message)
      done()
    })
  })
})

describe('When an user or adm tries to add a message', () => {
  describe('With any empty field', () => {
    it('should return an exception', (done) => {

      seneca.act('role:message,cmd:add', {
        description: 'Rails Sinatra',
        id_user: 'he',
        main_message: true
      }, (err, message) => {

        if (err)
          return done()

        done(new Error('Did not return an error'))
      })
    })
  })
  describe('With all fields correctly filled', () => {
    it('should return the inserted register', (done) => {

      seneca.act('role:message,cmd:add', {
        title: 'Node.js Message',
        description: 'Test',
        id_user: 'she',
        id_topic: '1',
        main_message: false
      }, (err, message) => {

        if (err)
          return done(err)

        assert.ok(message)
        done()
      })
    })
  })
})
