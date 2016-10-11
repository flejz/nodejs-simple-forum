const assert = require('chai').assert
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/user')

const mock = require('../mock/mock-user')(seneca)

before((done) => {
  mock.it().then(() => {
    done()
  })
})

describe('When request an user by id', () => {
  it('should return the register', (done) => {

    seneca.act('role:user,cmd:get', {
      id: 'me'
    }, (err, user) => {

      if (err)
        return done(err)

      assert.isDefined(user)
      done()
    })
  })
})

describe('When request an user by token', () => {
  it('should return the register', (done) => {

    seneca.act('role:user,cmd:get', {
      token: 'me_token'
    }, (err, user) => {

      if (err)
        return done(err)

      assert.ok(user)
      done()
    })
  })
})

describe('When an user tries to register', () => {
  describe('With any empty field', () => {
    it('should return an exception', (done) => {

      seneca.act('role:user,cmd:add', {
        name: 'Jaime',
        username: '',
        password: 'test',
        isAdm: true
      }, (err, user) => {

        if (err)
          return done()

        done(new Error('Did not return an error'))
      })
    })
  })
  describe('With all fields correctly filled', () => {
    describe('With password mismatching', () => {
      it('should return an exception', (done) => {

        seneca.act('role:user,cmd:add', {
          name: 'Jaime',
          username: 'jaimelopesflores',
          password: 'jaime',
          passwordMatch: 'emiaj',
          isAdm: true
        }, (err, user) => {

          if (err)
            return done()

          done(new Error('Did not return an error'))
        })
      })
    })
    describe('With password matching', () => {
      describe('With an existing username', () => {
        it('should return an exception', (done) => {

          seneca.act('role:user,cmd:add', {
            name: 'Jaime',
            username: 'devandroll',
            password: 'devandroll',
            passwordMatch: 'jaime',
            isAdm: true
          }, (err, user) => {

            if (err)
              return done()

            done(new Error('Did not return an error'))
          })
        })
      })

      describe('With an unexistant username', () => {
        it('should return the inserted register with token', (done) => {

          seneca.act('role:user,cmd:add', {
            name: 'Jaime',
            username: 'jaimeflores_',
            password: 'jaime',
            passwordMatch: 'jaime',
            isAdm: true
          }, (err, user) => {

            if (err)
              return done(err)

            var teste = assert.isDefined(user.token)

            done()
          })
        })
      })
    })
  })
})

describe('When an user tries to login', () => {
  describe('With any empty field', () => {
    it('should return an exception', (done) => {

      seneca.act('role:user,cmd:login', {
        username: '',
        password: 'test'
      }, (err, user) => {

        if (err)
          return done()

        done(new Error('Did not return an error'))
      })
    })
  })
  describe('With invalid Credentials', () => {
    it('should return an exception', (done) => {

      seneca.act('role:user,cmd:login', {
        username: 'jaimelopesflores',
        password: 'jaime_flores'
      }, (err, user) => {

        if (err)
          return done()

        done(new Error('Did not return an error'))
      })
    })
  })
  describe('With valid credentials', () => {
    it('should return the user register', (done) => {

      seneca.act('role:user,cmd:login', {
        username: 'dev',
        password: 'dev'
      }, (err, user) => {

        if (err)
          return done(err)

        assert.ok(user)
        done()
      })
    })
  })
})
