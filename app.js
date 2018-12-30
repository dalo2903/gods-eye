var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var engine = require('ejs-locals')
var fileUpload = require('express-fileupload')
var session = require('express-session')
var enforce = require('express-sslify')

require('dotenv').config()

var serveIndex = require('serve-index')

const config = require('./config')

require('./configs/loadModelsMongoose')

var routeAuthAPI = require('./api/routes/auth')
var routeFaceAPI = require('./api/routes/face')
var locationRouteAPI = require('./api/routes/location')
var routePersonAPI = require('./api/routes/person')
var routeUserAPI = require('./api/routes/user')
var postRouteAPI = require('./api/routes/post')
var visualDataRouteAPI = require('./api/routes/visualdata')
var routeNotificationAPI = require('./api/routes/notification')
var routeRecordAPI = require('./api/routes/record')
var index = require('./routes/index')

var app = express()
if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}
app.use(cookieParser())

app.use(session({
  httpOnly: true,
  secret: config.token.secret,
  resave: true,
  saveUninitialized: false
}))

const passport = require('passport')

require('./api/services/passport')

app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', engine)

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/ftp', express.static('../'), serveIndex('../', { 'icons': true }))

app.use(fileUpload())

app.use('/api/auth/', routeAuthAPI)
app.use('/api/face/', routeFaceAPI)
app.use('/api/location/', locationRouteAPI)
app.use('/api/person/', routePersonAPI)
app.use('/api/post/', postRouteAPI)
app.use('/api/visual-data/', visualDataRouteAPI)
app.use('/api/user/', routeUserAPI)
app.use('/api/notification/', routeNotificationAPI)
app.use('/api/record/', routeRecordAPI)
app.use('/', index)

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

// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'nguyenkhanhnam.13a@gmail.com',
//   from: 'projectGodEyes@gmail.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//   templateId: 'd-4ebbf9be969b4873b26c61b18f397919',
//   dynamic_template_data: {
//     url: '/'
//   }
// }
// sgMail.send(msg).then(() => console.log('Mail sent successfully'))
//   .catch(error => console.error(error.toString()))

module.exports = app
