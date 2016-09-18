module.exports = function message() {

  // Get all messages by topic
  this.add('role:message,cmd:all', (params, respond) => {
    if (!params.id_topic) {
      return respond(new Error('Params are empty'))
    }

    this.make('message').list$({
      id_topic: params.id_topic,
      sort$: {
        main_message: -1,
        date: 1
      }
    }, (err, data) => {
      return respond(err, data)
    })
  })

  // Gets message
  this.add('role:message,cmd:get', (params, respond) => {

    if (!params.id) {
      return respond(new Error('Params are empty'))
    }

    this.make('message').load$(params.id, (err, data) => {

      respond(err, data)
    })
  })

  // Add user
  this.add('role:message,cmd:add', (params, respond) => {

    if (params.title == undefined || params.title == '' ||
      params.description == undefined || params.description == '' ||
      params.id_user == undefined || params.id_user == '' ||
      params.id_topic == undefined || params.id_topic == '') {

      return respond(new Error('Incomplete params'))
    }
    if (params.main_message == undefined)
      params.main_message = false

    var message = this.make('message')
    message.title = params.title
    message.description = params.description
    message.id_user = params.id_user
    message.id_topic = params.id_topic
    message.main_message = params.main_message
    message.date = new Date()

    message.save$(function (err, obj) {
      respond(err, obj)
    })
  })

  // Deletes
  this.add('role:message,cmd:del', (params, respond) => {

    if (params.id == undefined || params.id == '' ||
      params.id_user == undefined || params.id_user == '') {

      return respond(new Error('Incomplete params'))
    }

    this.act('role:message,cmd:get', {
      id: params.id
    }, (err, message) => {

      this.act('role:user,cmd:get', {
        id: params.id_user
      }, (err, user) => {

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
