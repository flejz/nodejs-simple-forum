const config = require('./app.config')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('./modules/user')
  .use('./modules/topic')
  .use('./modules/message')


const auth = require('./app.auth')(seneca)
const error = require('./app.error')()
const app = express()

app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())

// Header and auth handlers
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization')
  next()
})
app.use(auth.parseHeader)

// Error handlers
app.use(error.parseError)

// Routing
const signin = require('./routes/signin')(seneca)
const signup = require('./routes/signup')(seneca)
const topic = require('./routes/topic')(seneca)
const message = require('./routes/message')(seneca)

app.use('/signin', signin)
app.use('/signup', signup)
app.use('/topic', topic)
app.use('/message', message)

// Static path to documentation
app.use(express.static(path.join(__dirname, 'apidoc')))
app.get('/', (req, res) =>{
  res.render('apidoc/index.html')
})

// Exporting module
module.exports = app

// Mocks data or connect to mongo
if (config.mockData) {
  const mockUser = require('./tests/mock/mock-user')(seneca)
  const mockTopic = require('./tests/mock/mock-topic')(seneca)
  const mockMessages = require('./tests/mock/mock-message')(seneca)


  console.log('> mongodb url is empty - mocking data')

  mockUser.it().then(() => {
    mockTopic.it().then(() => {
      mockMessages.it().then(() => {
        console.log('> data mock succeed')
      })
    })
  })
} else {
  seneca.use('mongo-store', {
    uri: config.mongoUrl
  })
}
