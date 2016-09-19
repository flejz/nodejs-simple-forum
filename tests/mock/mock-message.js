module.exports = function(seneca) {

  // List
  var messages = [{
    id: '1',
    title: 'Message Node.js',
    description: 'Express Jade',
    id_user: 'me',
    id_topic: '1',
    main_message: true
  }, {
    id: '2',
    title: 'Message Python',
    description: 'Flask Django',
    id_user: 'she',
    id_topic: '2',
    main_message: true
  }, {
    id: '3',
    title: 'Message Ruby',
    description: 'Rails Sinatra',
    id_user: 'he',
    id_topic: '3',
    main_message: true
  }]

  // Mock message
  function _mockMessage(msg) {
    return new Promise(function(resolve, reject) {

      var message = seneca.make('message')
      message.id = msg.id
      message.title = msg.title
      message.description = msg.description
      message.id_user = msg.id_user
      message.id_topic = msg.id_topic
      message.main_message = msg.main_message
      message.date = new Date()

      message.save$(function(err, obj) {
        if (err)
          reject(err)
        resolve(obj)
      })
    })
  }

  // Mock all the messages
  function _mockMessages() {
    return new Promise((resolve, reject) => {
      var promise = []
      messages.forEach(msg => {
        promise.push(_mockMessage(msg))
      })

      Promise.all(promise).then(msgs => {
        resolve(msgs)
      })
    })
  }

  return {
    it: () => {

      return new Promise((resolve, reject) => {

        seneca.ready(() => {

          _mockMessages().then(messages => {

            resolve(messages)
          })
        })
      })
    }
  }
}
