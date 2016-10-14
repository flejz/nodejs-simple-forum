module.exports = function (seneca) {
  'use strict'

  const router = require('express').Router()
  const error = require('../app.error')()

  /**
   * @api {post} /signup/ Signs up a new user
   * @apiGroup User

   * @apiParam {String} name The name of the user.
   * @apiParam {String} username The username.
   * @apiParam {String} password The password.
   * @apiParam {String} passwordMatch The password confirmation.
   * @apiParam {Boolean} isAdm If the user is an administrator.

   * @apiSuccess {Object}  result The user information
   * @apiSuccess {String}  result.token The user access token.
   */
  router.post('/', function (req, res, next) {

    seneca.act('role:user,cmd:add', {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      passwordMatch: req.body.passwordMatch,
      isAdm: req.body.isAdm === true
    }, (err, user) => {

      if (err) {
        if (err.details.message == 'Password mismatch')
          return error.handle(res, {
            message: "Password mismatch"
          })
        else
          return error.handle(res, err)
      }

      res.json({
        result: user
      })
    })
  })

  return router
}
