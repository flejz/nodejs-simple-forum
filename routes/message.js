module.exports = function(seneca) {
  'use strict'

  const router = require('express').Router()
  const auth = require('../app.auth')(seneca)
  const error = require('../app.error')()

  /**
   * Adds a new message
   * @route POST /message
   */
  router.post('/',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      seneca.act('role:message,cmd:add', {
        title: req.body.title,
        description: req.body.description,
        id_topic: req.body.id_topic,
        id_user: req.user.id,

      }, (err, message) => {

        if (err) {
          return error.handle(res, err)
        }

        res.json({result: message})
      })
    })

    /**
     * Updates a topic
     * @route POST topic/
     */
    router.put('/',
      auth.parseHeader,
      auth.parseToken,
      function(req, res) {

        // Updates the message
        seneca.act('role:message,cmd:update', {
          id: req.body.id,
          title: req.body.title,
          description: req.body.description,
          id_user: req.user.id,
        }, (err,  message) => {

          if (err || ! message) {
            return error.handle(res, err || {
              message: "Message not found"
            }, err ? 500 : 404)
          }
          return res.json({
            result: message
          })
        })
      })

  /**
   * Deletes a specific message by id
   * @route DELETE message/ID
   */
  router.delete('/',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      seneca.act('role:message,cmd:del', {
        id: req.query.id,
        id_user: req.user.id
      }, err => {

        if (err) {
          return error.handle(res, err)
        }

        return res.json({
          result: {
            success: true
          }
        })
      })
    })

  return router
}
