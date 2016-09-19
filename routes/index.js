module.exports = function(seneca) {

  const router = require('express').Router()
  const auth = require('../modules/auth')

  router.get('/', function(req, res) {

    if (!req.session || !req.session.loggedUser) {

      return res.render('index', {
        title: 'Home',
        logged: false
      })
    }

    seneca.act('role:topic,cmd:all', (err, topics) => {

      var user = req.session.loggedUser

      for (var i in topics) {
        topics[i].canDelete = user.isAdm || user.id == topics[i].id_user
      }

      res.render('index', {
        title: 'Topics',
        logged: true,
        topics: topics
      })
    })
  })

  return router
}
