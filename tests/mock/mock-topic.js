module.exports = function(seneca) {

  // List
  var topics = [{
    id: '1',
    title: 'Node.js',
    description: 'Express Jade',
    id_user: 'me'
  }, {
    id: '2',
    title: 'Python',
    description: 'Flask Django',
    id_user: 'she'
  }, {
    id: '3',
    title: 'Ruby',
    description: 'Rails Sinatra',
    id_user: 'he'
  }]

  // Mock topic
  function _mockTopic(tpc) {
    return new Promise(function(resolve, reject) {

      var topic = seneca.make('topic')
      topic.id = tpc.id
      topic.title = tpc.title
      topic.description = tpc.description
      topic.id_user = tpc.id_user
      topic.date = new Date()

      topic.save$(function(err, obj) {
        if (err)
          reject(err)
        resolve(obj)
      })
    })
  }

  // Mock all the topics
  function _mockTopics() {
    return new Promise((resolve, reject) => {
      var promise = []
      topics.forEach(tpc => {
        promise.push(_mockTopic(tpc))
      })

      Promise.all(promise).then(tpcs => {
        resolve(tpcs)
      })
    })
  }

  return {
    it: () => {
      return new Promise((resolve, reject) => {

        seneca.ready(() => {

          _mockTopics().then(topics => {

            resolve(topics)
          })
        })
      })
    }
  }
}
