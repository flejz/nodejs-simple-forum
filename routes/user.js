module.exports = function (seneca) {

  const router = require('express').Router()
  const auth = require('../modules/auth')

  router.get('/logout', function (req, res) {
    req.session.loggedUser = null
    res.redirect('/')
  })

  router.get('/login', function (req, res) {
    res.render('login', {
      title: 'Login',
      isLogging: true
    })
  })

  router.post('/login', function (req, res, next) {

    seneca.act('role:user,cmd:login', {
      username: req.body.username,
      password: req.body.password
    }, (err, user) => {
      if (err) {
        if (err.details.message == 'Invalid credentials')
          res.render('login', {
            invalidCredentials: true
          })
        else
          res.render('error', err)
      } else
        req.session.loggedUser = user
      res.redirect('/')
    })
  })

  return router;
}
