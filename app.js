const config = require('./config');
const express = require('express');
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('./modules/topic')
  .use('./modules/user')
  .use('./modules/topic')
  .use('./modules/message')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(session({
  secret: 'qmagico',
  resave: false,
  saveUninitialized: true
}))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const index = require('./routes/index')(seneca)
const user = require('./routes/user')(seneca)
const register = require('./routes/register')(seneca)
const topic = require('./routes/topic')(seneca)

app.use('/', index)
app.use('/user', user)
app.use('/register', register)
app.use('/topic', topic)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

// Exporting module
module.exports = app

// Mocks data if mongo url is not defined
if (config.mongoUrl == '') {
  const mockUser = require('./tests/mock/mock-user')(seneca)
  const mockTopic = require('./tests/mock/mock-topic')(seneca)
  const mockMessages = require('./tests/mock/mock-message')(seneca)

  mockUser.it().then(() => {
    mockTopic.it().then(() => {
      mockMessages.it().then(() => {
        console.log('> mongodb url is empty - mocking data')
        console.log('> data mock succeed')
      })
    })
  })
}
