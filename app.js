var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var engine = require('ejs-locals')
var fileUpload = require('express-fileupload')

var serveIndex = require('serve-index')

var routeAuthAPI = require('./api/routes/auth')
var routeFaceAPI = require('./api/routes/face')
var routePersonAPI = require('./api/routes/person')
var index = require('./routes/index')
var users = require('./routes/users')

var app = express()
app.use(cookieParser())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', engine)

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/ftp', express.static('../'), serveIndex('../', {'icons': true}))

app.use(fileUpload())

app.use('/api/auth/', routeAuthAPI)
app.use('/api/face/', routeFaceAPI)
app.use('/api/person/', routePersonAPI)
app.use('/', index)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
