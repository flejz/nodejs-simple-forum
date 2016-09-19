module.exports = function (seneca) {

  const router = require('express').Router()
  const auth = require('../modules/auth')

  router.get('/new', auth, function (req, res) {
    res.render('topic/new', {
      title: 'New Topic',
      logged: true
    })
  })

  router.get('/:id', auth, function (req, res) {

    seneca.act('role:topic,cmd:get', {
      id: req.params.id
    }, (err, topic) => {

      if (err) {
        res.render('error', err)
      }
      seneca.act('role:message,cmd:all', {
        id_topic: topic.id
      }, (err, messages) => {

        if (err) {
          res.render('error', err)
        }
        res.render('topic/view', {
          title: 'Topic',
          topic: topic,
          messages: messages,
          logged:true
        })
      })
    })
  })

  router.post('/add', auth, function (req, res, next) {

    seneca.act('role:topic,cmd:add', {
      title: req.body.title,
      description: req.body.description,
      id_user: req.session.loggedUser.id
    }, (err, topic) => {

      if (err) {
        res.render('error', err)
      }

      seneca.act('role:message,cmd:add', {
        title: req.body.title,
        description: req.body.message,
        id_user: req.session.loggedUser.id,
        id_topic: topic.id,
        main_message: true
      }, (err, message) => {

        if (err) {
          res.render('error', err)
        }

        res.redirect('/')
      })

    })
  })

  router.get('/:id/message', auth, function (req, res) {

    res.render('message/new', {
      title: 'Message - Comment',
      logged:true
    })
  })

  router.post('/:id/message', auth, function (req, res) {

    seneca.act('role:message,cmd:add', {
      title: req.body.title,
      description: req.body.description,
      id_user: req.session.loggedUser.id,
      id_topic: req.params.id
    }, (err, message) => {

      if (err) {
        return res.render('error', err)
      }

      res.redirect('/topic/' + req.params.id)
    })
  })

  return router;
}
