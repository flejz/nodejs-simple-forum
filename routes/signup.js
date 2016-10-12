module.exports = function (seneca) {
  'use strict'

  const router = require('express').Router()
  const error = require('../app.error')()

  /**
   * Signs up a new user
   * @route signup/
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
