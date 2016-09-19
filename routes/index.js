module.exports = function (seneca) {

  const router = require('express').Router()
  const auth = require('../modules/auth')

  router.get('/', function (req, res) {

    if (!req.session || !req.session.loggedUser) {

      return res.render('index', {
        title: 'Home',
        logged: false
      })
    }

    seneca.act('role:topic,cmd:all', (err, topics) => {

      res.render('index', {
        title: 'Topics',
        logged: true,
        topics: topics
      })
    })
  })

  return router;
}
