module.exports = function topic() {

  // Get all the topics
  this.add('role:topic,cmd:all', (data, respond) => {

    this.make('topic').list$({
      sort$: {
        date: -1
      }
    }, (err, data) => {
      return respond(err, data)
    })
  })

  // Gets topic
  this.add('role:topic,cmd:get', (params, respond) => {

    if (!params.id) {
      return respond(new Error('Params are empty'))
    }

    this.make('topic').load$(params.id, (err, data) => {

      respond(err, data)
    })
  })

  // Add user
  this.add('role:topic,cmd:add', (params, respond) => {

    if (params.title == undefined || params.title == '' ||
      params.description == undefined || params.description == '' ||
      params.id_user == undefined || params.id_user == '') {

      return respond(new Error('Incomplete params'))
    }

    var topic = this.make('topic')
    topic.title = params.title
    topic.description = params.description
    topic.id_user = params.id_user
    topic.date = new Date()

    topic.save$(function(err, obj) {
      respond(err, obj)
    })
  })

  // Deletes
  this.add('role:topic,cmd:del', (params, respond) => {

    if (params.id == undefined || params.id == '' ||
      params.id_user == undefined || params.id_user == '') {

      return respond(new Error('Incomplete params'))
    }

    this.act('role:topic,cmd:get', {
      id: params.id
    }, (err, topic) => {

      this.act('role:user,cmd:get', {
        id: params.id_user
      }, (err, user) => {

        if (user.isAdm || topic.id_user == user.id) {

          // removing messages
          this.act('role:message,cmd:all', {
            id_topic: topic.id
          }, (err, messages) => {
            messages.forEach(message => {
              message.remove$((err) => {
                return respond(err)
              })
            })
          })

          // removing topic
          this.make('topic').remove$(topic.id, (err) => {
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
