module.exports = function(seneca) {
  'use strict'

  const router = require('express').Router()
  const auth = require('../app.auth')(seneca)
  const error = require('../app.error')()

  /**
   * @api {get} /topic/ Gets all the topics
   * @apiGroup Topic

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiSuccess {Object}  result The topic list
   */
  router.get('/',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      // Gets all the topics
      seneca.act('role:topic,cmd:all', (err, topics) => {

        topics.forEach(topic => {
          topic.canDelete = req.user.isAdm || req.user.id == topic.id_user
          topic.canEdit = req.user.id == topic.id_user
        })

        return res.json({
          result: topics
        })
      })
    })

  /**
   * @api {post} /topic/ Inserts a topic
   * @apiGroup Topic

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiParam {String} title The title.
   * @apiParam {String} description The description.

   * @apiSuccess {Object}  result The topic
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

        res.json({
          result: topic
        })
      })
    })

  /**
   * @api {put} /topic/ Updates a topic
   * @apiGroup Topic

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiParam {String} id The topic id.
   * @apiParam {String} title The title.
   * @apiParam {String} description The description.

   * @apiSuccess {Object}  result The topic
   */
  router.put('/',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      // Updates the topic
      seneca.act('role:topic,cmd:update', {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        id_user: req.user.id
      }, (err, topic) => {

        if (err || !topic) {
          return error.handle(res, err || {
            message: "Topic not found"
          }, err ? 500 : 404)
        }

        topic.canDelete = req.user.isAdm || req.user.id == topic.id_user
        topic.canEdit = req.user.id == topic.id_user

        return res.json({
          result: topic
        })

      })
    })

  /**
   * @api {delete} /topic/ Deletes a topic
   * @apiGroup Topic

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiParam {String} id The topic id.

   * @apiSuccess {Object}  result The success confirmation
   */
  router.delete('/',
    auth.parseHeader,
    auth.parseToken,
    function(req, res) {

      seneca.act('role:topic,cmd:del', {
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

  /**
   * @api {get} /topic/:id Gets a topic by id
   * @apiGroup Topic

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiParam {String} id The topic id.

   * @apiSuccess {Object}  result The topic and all the relationes messages
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

        seneca.act('role:message,cmd:by_topic', {
          id_topic: topic.id
        }, (err, messages) => {

          if (err) {
            return error.handle(res, err)
          }

          let user = req.user

          topic.canDelete = req.user.isAdm || req.user.id == topic.id_user
          topic.canEdit = req.user.id == topic.id_user
          topic.messages = messages
          topic.messages.forEach(message => {
            message.canDelete = user.isAdm || user.id ==
              message.id_user
            message.canEdit = user.id == message.id_user
          })

          return res.json({
            result: topic
          })
        })
      })
    })

  return router
}
