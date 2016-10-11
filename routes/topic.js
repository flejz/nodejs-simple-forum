module.exports = function(seneca) {
  'use strict'

  const router = require('express').Router()
  const auth = require('../app.auth')(seneca)
  const error = require('../app.error')()

  /**
   * Gets all topics
   * @route GET topic/
   */
  router.get('/',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      // Gets all the topics
      seneca.act('role:topic,cmd:all', (err, topics) => {

        topics.forEach(topic => {
          topic.canDelete = req.user.isAdm || req.user.id == topic.id_user
        })

        return res.json({
          result: topics
        })
      })
    })

  /**
   * Inserts a new topic
   * @route POST topic/
   */
  router.post('/',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      // Adds the topic
      seneca.act('role:topic,cmd:add', {
        title: req.body.title,
        description: req.body.description,
        id_user: req.user.id
      }, (err, topic) => {

        if (err) {
          return error.handle(res, err)
        }

        // Adds the message
        seneca.act('role:message,cmd:add', {
          title: req.body.title,
          description: req.body.message,
          id_user: req.user.id,
          id_topic: topic.id,
          main_message: true
        }, (err, message) => {

          // If any error occurs adding the message,
          // then deletes the topic
          if (err) {

            seneca.act('role:topic,cmd:del', {
              id: topic.id,
              id_user: req.user.id
            })

            return error.handle(res, err)
          }

          res.json({
            result: topic
          })
        })

      })
    })

  /**
   * Gets a specific topic by id
   * @route GET topic/ID
   */
  router.get('/:id',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      seneca.act('role:topic,cmd:get', {
        id: req.params.id
      }, (err, topic) => {

        if (err || !topic) {
          return error.handle(res, err || {
            message: "Topic not found"
          }, err ? 500 : 404)
        }

        seneca.act('role:message,cmd:all', {
          id_topic: topic.id
        }, (err, messages) => {

          if (err) {
            return error.handle(res, err)
          }

          let user = req.user

          topic.canDelete = user.isAdm || user.id == topic.id_user
          topic.messages = messages
          topic.messages.forEach(message => {
            messages.canDelete = user.isAdm || user.id ==
              message.id_user
          })

          return res.json({
            result: topic
          })
        })
      })
    })

  /**
   * Deletes a specific topic by id
   * @route DELETE topic/ID
   */
  router.delete('/:id',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      seneca.act('role:topic,cmd:del', {
        id: req.params.id,
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
