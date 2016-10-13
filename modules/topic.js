module.exports = function topic() {
  'use strict'

  /**
   * Gets all topics date ordered
   */
  this.add('role:topic,cmd:all', (data, respond) => {

    this.make('topic').list$({
      sort$: {
        date: -1
      }
    }, (err, data) => {
      return respond(err, data)
    })
  })

  /**
   * Gets the topic by id
   * @param id: The topic id
   */
  this.add('role:topic,cmd:get', (params, respond) => {

    if (!params.id) {
      return respond(new Error('Params are empty'))
    }

    this.make('topic').load$(params.id, (err, data) => {

      respond(err, data)
    })
  })

  /**
   * Adds a new topic
   * @param title: The topic title
   * @param description: The topic description
   * @param id_user: The topic user id
   */
  this.add('role:topic,cmd:add', (params, respond) => {

    if (!params.title || params.title == '' ||
      !params.description || params.description == '' ||
      !params.id_user || params.id_user == '') {

      return respond(new Error('Incomplete params'))
    }

    var topic = this.make('topic')
    topic.title = params.title
    topic.description = params.description
    topic.id_user = params.id_user
    topic.date = new Date()

    topic.save$(function (err, obj) {
      respond(err, obj)
    })
  })

  /**
   * Updates the topic
   * @param id: The topic id
   * @param title: The topic title
   * @param description: The topic description
   * @param id_user: The topic user id
   */
  this.add('role:topic,cmd:update', (params, respond) => {

    if (!params.id || params.id == '' ||
      !params.title || params.title == '' ||
      !params.description || params.description == '' ||
      !params.id_user || params.id_user == '') {

      return respond(new Error('Incomplete params'))
    }

    // Gets the user
    this.act('role:user,cmd:get', {
      id: params.id_user
    }, (err, user) => {

      if (err || !user) {
        return respond(err || new Error('User not found'))
      }

      // Gets the topic
      this.act('role:topic,cmd:get', {
        id: params.id
      }, (err, topic) => {

        if (err || !topic) {
          return respond(err || new Error('Topic not found'))
        } else if (!user.isAdm && topic.id_user != user.id) {
          return respond(new Error(
            'User can not update this topic'))
        }

        topic.title = params.title
        topic.description = params.description
        topic.id_user = params.id_user  

        return topic.save$(function (err, obj) {
          respond(err, obj)
        })
      })
    })
  })

  /**
   * Deletes a topic
   * @param id: The topic id
   * @param id_user: The user id
   */
  this.add('role:topic,cmd:del', (params, respond) => {

    if (params.id == undefined || params.id == '' ||
      params.id_user == undefined || params.id_user == '') {

      return respond(new Error('Incomplete params'))
    }

    // Gets the user
    this.act('role:user,cmd:get', {
      id: params.id_user
    }, (err, user) => {

      if (err || !user) {
        return respond(err || new Error('User not found'))
      }

      // Gets the topic
      this.act('role:topic,cmd:get', {
        id: params.id
      }, (err, topic) => {

        if (err || !topic) {
          return respond(err || new Error('Topic not found'))
        } else if (!user.isAdm && topic.id_user != user.id) {
          return respond(new Error(
            'User can not delete this topic'))
        }

        // Gets the messages
        this.act('role:message,cmd:by_topic', {
          id_topic: topic.id
        }, (err, messages) => {

          // reduce the array o the canModify variable
          let canModify = user.isAdm ? true : messages.reduce(
            (previous, current) => {
              if (!previous)
                return previous
              return (user.isAdm || current.id_user == user
                .id)
            }, true);

          if (!canModify) {
            return respond(new Error(
              'User can not delete this topic because there are messages from other users'
            ))
          } else {

            // removing topic
            topic.remove$(err => {
              messages.forEach(message => {
                message.remove$(err => {})
              })

              return respond(err)
            })
          }
        })
      })
    })
  })
}
