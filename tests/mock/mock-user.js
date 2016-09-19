module.exports = function(seneca) {

  // List
  var users = [{
    name: 'Jaime Flores',
    id: 'me',
    username: 'j',
    password: 'j',
    isAdm: true
  }, {
    id: 'she',
    name: 'Anna Losch',
    username: 'annalos',
    password: 'anna',
    isAdm: false
  }, {
    id: 'he',
    name: 'Germán Castillo',
    username: 'germancas',
    password: 'german',
    isAdm: false
  }]

  // Mock user
  function _mockUser(usr) {
    return new Promise(function(resolve, reject) {

      var user = seneca.make('user')
      user.id = usr.id
      user.name = usr.name
      user.username = usr.username
      user.password = usr.password
      user.isAdm = usr.isAdm

      user.save$(function(err, obj) {
        if (err)
          reject(err)
        resolve(obj)
      })
    })
  }

  // Mock all the users
  function _mockUsers() {
    return new Promise((resolve, reject) => {
      var promise = []
      users.forEach(usr => {
        promise.push(_mockUser(usr))
      })

      Promise.all(promise).then(usrs => {
        resolve(users = usrs)
      })
    })
  }

  return {
    me: () => users[0],
    it: () => {

      return new Promise((resolve, reject) => {

        seneca.ready(() => {

          _mockUsers().then(users => {

            resolve(users)
          })
        })
      })
    }
  }
}
