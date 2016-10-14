module.exports = function(seneca) {
  'use strict'

  const router = require('express').Router()
  const auth = require('../app.auth')(seneca)
  const error = require('../app.error')()

  /**
   * @api {post} /message/ Inserts a message
   * @apiGroup Message

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiParam {String} title The title.
   * @apiParam {String} description The description.

   * @apiSuccess {Object}  result The message
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

        res.json({
          result: message
        })
      })
    })

  /**
   * @api {put} /message/ Updates a message
   * @apiGroup Message

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiParam {String} id The message id.
   * @apiParam {String} title The title.
   * @apiParam {String} description The description.

   * @apiSuccess {Object}  result The message
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
      }, (err, message) => {

        if (err || !message) {
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
   * @api {delete} /message/ Deletes a message
   * @apiGroup Message

   * @apiHeader {String} Authorization Authorization bearer token.
   * @apiHeaderExample {json} Request-Example:
   *             { "authorization": "tag token" }

   * @apiParam {String} id The message id.

   * @apiSuccess {Object}  result The success confirmation
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
