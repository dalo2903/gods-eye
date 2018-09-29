var express = require('express')
// var async = require('async')
var router = express.Router()
// var config = require('../config')
var constants = require('../configs/constants')
// const Storage = require('@google-cloud/storage')
// var path = require('path')
// var request = require('request')
// var FaceController = require('../api/controllers/FaceController')
// var admin = require('../api/controllers/firebaseAdminController')
// var authController = require('../api/controllers/authController')
// var responseStatus = require('../configs/responseStatus')
const AuthService = require('../api/services/AuthService')
// var db = admin.database()
// var imageRef = db.ref('image')
// var userRef = db.ref('user')
// const storage = new Storage({
//   projectId: config.google.projectId
// })

// // The name for the new bucket
// const bucketName = config.google.cloudStorage.bucketName
// const imageApi = 'http://storage.googleapis.com/centering-dock-194606.appspot.com/images/'

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})



router.get('/about', function (req, res, next) {
  return res.render('about', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/sign-up', (req, res) => {
  return res.render('share/sign-up', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/location/:id', function (req, res, next) {
  return res.render('post/posts-by-location', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    locationId: req.params.id
  })
})

router.get('/*', async (req, res, next) => {
  try {
    const token = AuthService.getTokenFromRequest(req)
    await AuthService.verifyJWTToken(token)
    return next()
  } catch (error) {
    return res.redirect('/')
  }
})
router.get('/post/edit/:id', (req, res) => {
  return res.render('post/edit', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    _id: req.params.id
  })
})
router.get('/post/create', (req, res) => {
  res.render('post/create', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/post/:id', (req, res) => {
  res.render('post/detail', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    _id: req.params.id
  })
})

router.get('/person/create', (req, res) => {
  res.render('person/create', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/person/face/add/:id', (req, res) => {
  res.render('person/add-face', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    _id: req.params.id
  })
})

router.get('/notification/:id', (req, res) => {
  res.render('notification/detail', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    _id: req.params.id
  })
})

router.get('/my-profile', (req, res) => {
  return res.render('my-profile', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/upload', function (req, res, next) {
  return res.render('upload', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/identify', function (req, res, next) {
  return res.render('identify', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/user/:id', function (req, res, next) {
  return res.render('user', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})
router.get('/user/:id/posts', function (req, res, next) {
  return res.render('user', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})
router.get('/user/:id/persons', function (req, res, next) {
  return res.render('user', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/gallery', (req, res) => {
  return res.render('gallery', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/person', (req, res) => {
  return res.render('person/list', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/label', (req, res) => {
  return res.render('post/video-labeling', {
    image: constants.index.image,
    description: constants.index.description,
    title: 'Video Labeling',
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

router.get('/admin', (req, res) => {
  return res.render('admin', {
    image: constants.index.image,
    description: constants.index.description,
    title: 'Admin Dashboard',
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : ''
  })
})

module.exports = router
