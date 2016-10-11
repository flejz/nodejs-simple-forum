/**
 * Microservice Module: User Module
 */
module.exports = function user() {

  'use strict'

  const webtoken = require("jsonwebtoken")
  const config = require("../app.config")

  /**
   * Gets the user by id
   * @param id: The user id
   */
  this.add('role:user,cmd:get', (params, respond) => {

    if (!params.id) {
      return respond(new Error('Params are empty'))
    }
    this.make('user').load$(params.id, (err, data) => {
      respond(err, data)
    })
  })

  /**
   * Gets the user by token
   * @param token: the user token
   */
  this.add('role:user,cmd:get,token:*', (params, respond) => {

    if (!params.token) {
      return respond(new Error('Params are empty'))
    }

    this.make('user').list$({
      token: params.token
    }, (err, data) => {

      if (!data || !data.length)
        return respond(new Error('User not found'))
      else if (data.length > 1)
        return respond(new Error('Multiple users found'))

      respond(err, data[0])
    })
  })

  /**
   * Adds a new user
   * @param name: The user name
   * @param username: The user username
   * @param password: The user password
   * @param passwordMatch: The user password confirmation
   * @param isAdm: If the user is an admin
   */
  this.add('role:user,cmd:add', (params, respond) => {

    if (!params.name || params.name == '' ||
      !params.username || params.username == '' ||
      !params.password || params.password == '' ||
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
      user.token = webtoken.sign(user, config.token_secret) // signing the webtoken

      user.save$(function(err, obj) {
        respond(err, obj)
      })
    })
  })

  /**
   * Logs in an existing user
   * @param username: The user username
   * @param password: The user password
   */
  this.add('role:user,cmd:login', (params, respond) => {

    if (!params.username || params.username == '' ||
      !params.password || params.password == '') {

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
      } else if (data.length > 1) {
        return respond(new Error('Multiple users found'))
      } else
        return respond(null, data[0])
    })
  })
}
