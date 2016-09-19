const assert = require('assert')
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/topic')

const mock = require('../mock/mock-topic')(seneca)

before((done) => {
  mock.it().then(() => {
    done()
  })
})

describe('When requesting all the topics', () => {
  it('should retrieve a list of all the topics ordered by date', (done) => {

    seneca.act('role:topic,cmd:all', (err, topics) => {

      if (err)
        return done(err)

      assert.ok(typeof topics == 'object' && topics.length)
      done()
    })
  })
})

describe('When requesting a topic by id', () => {
  it('should return the register', (done) => {
    seneca.act('role:topic,cmd:get', {
      id: '1'
    }, (err, topic) => {

      if (err)
        return done(err)

      assert.ok(topic)
      done()
    })
  })
})

describe('When an user or adm tries to add a topic', () => {
  describe('With any empty field', () => {
    it('should return an exception', (done) => {

      seneca.act('role:topic,cmd:add', {
        title: 'Node.js',
        description: ''
      }, (err, topic) => {

        if (err)
          return done()

        done(new Error('Did not return an error'))
      })

    })
  })
  describe('With all fields correctly filled', () => {
    it('should return the inserted register', (done) => {

      seneca.act('role:topic,cmd:add', {
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
  })
})
