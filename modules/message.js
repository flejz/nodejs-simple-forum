module.exports = function message() {


  /**
   * Gets all messages by topic
   * @param title: The topic id
   */
  this.add('role:message,cmd:by_topic', (params, respond) => {
    if (!params.id_topic) {
      return respond(new Error('Params are empty'))
    }

    this.make('message').list$({
      id_topic: params.id_topic,
      sort$: {
        date: 1
      }
    }, (err, data) => {
      return respond(err, data)
    })
  })

  /**
   * Gets a message by id
   * @param title: The id
   */
  this.add('role:message,cmd:get', (params, respond) => {

    if (!params.id) {
      return respond(new Error('Params are empty'))
    }

    this.make('message').load$(params.id, (err, data) => {

      respond(err, data)
    })
  })

  /**
   * Adds a new message
   * @param title: The title
   * @param description: The description
   * @param id_user: The user id
   * @param id_topic: The topic id
   */
  this.add('role:message,cmd:add', (params, respond) => {

    if (params.title == undefined || params.title == '' ||
      params.description == undefined || params.description == '' ||
      params.id_user == undefined || params.id_user == '' ||
      params.id_topic == undefined || params.id_topic == '') {

      return respond(new Error('Incomplete params'))
    }

    var message = this.make('message')
    message.title = params.title
    message.description = params.description
    message.id_user = params.id_user
    message.id_topic = params.id_topic
    message.date = new Date()

    message.save$(function(err, obj) {
      respond(err, obj)
    })
  })

  /**
   * Adds a new message
   * @param title: The title
   * @param description: The description
   * @param id_user: The user id
   * @param id_topic: The topic id
   */
  this.add('role:message,cmd:update', (params, respond) => {

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
      this.act('role:message,cmd:get', {
        id: params.id
      }, (err, message) => {

        if (err || !message) {
          return respond(err || new Error('Topic not found'))
        } else if (!user.isAdm && message.id_user != user.id) {
          return respond(new Error(
            'User can not update this message'))
        }

        message.title = params.title
        message.description = params.description
        message.id_user = params.id_user

        return message.save$(function (err, obj) {
          respond(err, obj)
        })
      })
    })
  })

  /**
   * Deletes a message
   * @param id: The message id
   * @param id_user: The user id
   */
  this.add('role:message,cmd:del', (params, respond) => {

    if (params.id == undefined || params.id == '' ||
      params.id_user == undefined || params.id_user == '') {

      return respond(new Error('Incomplete params'))
    }

    this.act('role:user,cmd:get', {
      id: params.id_user
    }, (err, user) => {

      if (err || !user) {
        return respond(err || new Error('User not found'))
      }

      this.act('role:message,cmd:get', {
        id: params.id
      }, (err, message) => {

        if (err || !message) {
          return respond(err || new Error('Message not found'))
        } else if (!user.isAdm && message.id_user != user.id) {
          return respond(new Error(
            'User can not update this message'))
        }

        if (user.isAdm || message.id_user == user.id) {

          this.make('message').remove$(message.id, (err) => {
            return respond(err)
          })
        } else {
          return respond(new Error(
            'User can not delete this register'))
        }

      })
    })
  })
}
