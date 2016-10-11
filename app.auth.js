module.exports = function auth(seneca) {
  'use strict'

  const config = require('./app.config')

  return {
    parseHeader: function (req, res, next) {

      let bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== 'undefined') {

        let bearer = bearerHeader.split(" ")

        // Validates if the bearer token has 2 values
        // Also validates if the bearer token has the same value as the tag
        if (bearer.length == 2) {
          if (bearer[0] === config.token_tag) {

            req.token = bearer[1];
          }
        }
      }

      next();
    },

    parseToken: function (req, res, next) {

      if (!req.token) {
        console.log('> token is not defined')
        return res.sendStatus(403)
      }

      seneca.act('role:user,cmd:get', {
        token: req.token
      }, (err, user) => {

        if (err) {
          console.log('> an error has occurred')
          return res.sendStatus(401)
        }
        delete req.token
        req.user = user
        next()
      })
    },

    isAdm: function (req, res, next) {

      if (!req.user) {
        console.log('> user is not defined')
        return res.sendStatus(403)
      }

      if (!req.user.isAdm) {
        res.sendStatus(401)
      } else {
        next()
      }

    }
  }

}
