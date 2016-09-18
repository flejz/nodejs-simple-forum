module.exports = function user() {

  // Gets user
  this.add('role:user,cmd:get', (params, respond) => {

    if (!params.id) {
      return respond(new Error('Params are empty'))
    }

    this.make('user').load$(params.id, (err, data) => {

      respond(err, data)
    })
  })

  // Add user
  this.add('role:user,cmd:add', (params, respond) => {

    if (params.name == undefined || params.name == '' ||
      params.username == undefined || params.username == '' ||
      params.password == undefined || params.password == '' ||
      params.isAdm == undefined) {

      return respond(new Error('Incomplete params'))
    } else if (params.password != params.passwordMatch) {
      return respond(new Error('Password mismatch'))
    }

    this.make('user').list$({
      username: params.username
    }, (err, data) => {

      if (err) {
        return respond(err)
      } else if (data && data.length) {
        return respond(new Error('User already exists'))
      }

      var user = this.make('user')
      user.name = params.name
      user.username = params.username
      user.password = params.password
      user.isAdm = params.isAdm

      user.save$(function (err, obj) {
        respond(err, obj)
      })
    })
  })

  // login
  this.add('role:user,cmd:login', (params, respond) => {

    if (params.username == undefined || params.username == '' ||
      params.password == undefined || params.password == '') {

      return respond(new Error('Incomplete params'))
    }

    this.make('user').list$({
      username: params.username,
      password: params.password
    }, (err, data) => {
      if (err) {
        return respond(err)
      } else if (!data || !data.length) {
        return respond(new Error('Invalid credentials'))
      } else
        return respond(null, data[0])
    })
  })
}
