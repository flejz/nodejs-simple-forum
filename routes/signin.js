module.exports = function(seneca) {
  'use strict'

  const router = require('express').Router()

  /**
   * Signs in an existing user
   * @route signin/
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
