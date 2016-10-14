const assert = require('chai').assert
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
})

// Message update
describe('When an user or adm tries to update a message', () => {
  describe('with any empty field', () => {
    it('should return an exception', (done) => {

      seneca.act('role:message,cmd:update', {
        id: '1',
        title: 'Node.js Message',
        id_user: 'he'
      }, (err, message) => {

        if (err){
          if (!!err.details && err.details.message == "Incomplete params")
            return done()
          else
            return done(err)
        }

        done(new Error('Did not return an error'))
      })

    })
  })
  describe('with all fields correctly filled', () => {

    describe('and is an administrator', () => {
      // body
      it('should return the updated register', (done) => {

        seneca.act('role:message,cmd:update', {
          id: '1',
          title: 'Node.js Message',
          description: 'Test',
          id_user: 'me',
          id_topic: '1'
        }, (err, message) => {

          if (err)
            return done(err)

          done()
        })
      })
    })

    describe('and is not an administrator ', () => {

      var data = {
        id: '3',
        title: 'Node.js Message',
        description: 'Test',
        id_user: 'she',
        id_topic: '1'
      }

      describe('and the message is not from himself', () => {

        it('should return an exception', function (done) {

          data.id_user = 'she'

          seneca.act('role:message,cmd:update', data , (err, message) => {

            if (err){
              if (!!err.details && err.details.message == "User can not update this message")
                return done()
              else
                return done(err)
            }

            done(new Error('Did not return an error'))
          })
        })
      })
      describe('and the message is from himself', () => {
        //
          it('should return the updated register', function (done) {

            data.id_user = 'he'

            seneca.act('role:message,cmd:update', data , (err, message) => {

              if (err){
                  return done(err)
              }

              done()
            })
          })
      })
    })
  })
})

// Topic update
describe('When an user or adm tries to update a topic', () => {
  describe('with any empty field', () => {
    it('should return an exception', (done) => {

      seneca.act('role:topic,cmd:update', {
        id: '1',
        title: 'Node.js',
        description: ''
      }, (err, topic) => {

        if (err){
          if (!!err.details && err.details.message == "Incomplete params")
            return done()
          else
            return done(err)
        }

        done(new Error('Did not return an error'))
      })

    })
  })
  describe('With all fields correctly filled', () => {

    describe('and is an administrator', () => {
      // body
      it('should return the updated register', (done) => {

        seneca.act('role:topic,cmd:update', {
          id: '1',
          title: 'Node.js',
          description: 'Express Jade',
          id_user: 'me'
        }, (err, topic) => {

          if (err)
            return done(err)

          assert.ok(topic)
          done()
        })
      })
    });

    describe('and is not an administrator ', () => {

      var data = {
        id: '3',
        title: 'Node.js',
        description: 'Express Jade',
        id_user: 'she'
      }

      describe('and the message is not from himself', () => {

        it('should return an exception', function (done) {

          seneca.act('role:topic,cmd:update', data , (err, topic) => {

            if (err){
              if (!!err.details && err.details.message == "User can not update this topic")
                return done()
              else
                return done(err)
            }

            done(new Error('Did not return an error'))
          })
        })
      })
      describe('and the message is from himself', () => {
        //
          it('should return the updated register', function (done) {

            data.id_user = 'he'

            seneca.act('role:topic,cmd:update', data , (err, topic) => {

              if (err){
                  return done(err)
              }

              done()
            })
          })
      })
    })
  })
})
