module.exports = function(seneca) {
  'use strict'

  const router = require('express').Router()

  /**
   * @api {post} /signin/ Signs in a new user
   * @apiGroup User

   * @apiParam {String} username The username.
   * @apiParam {String} password The password.

   * @apiSuccess {Object}  result The user information
   * @apiSuccess {String}  result.token The user access token.
   */
  router.post('/', function(req, res) {

    seneca.act('role:user,cmd:login', {
      username: req.body.username,
      password: req.body.password
    }, (err, user) => {

      if (err) {
        return res.status(401).json({
          error: {
            message: err.details.message
          }
        })
      }

      res.json({
        result: user
      })
    })
  })

  return router
}
