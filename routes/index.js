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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})

router.get('/terms', function (req, res, next) {
  return res.render('terms', {
    image: constants.index.image,
    description: constants.index.description,
    title: 'Terms and Conditions.',
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})

router.get('/sign-in', async (req, res) => {
  try {
    const token = AuthService.getTokenFromRequest(req)
    await AuthService.verifyJWTToken(token)
    return res.redirect('/')
  } catch (error) {
    return res.render('share/sign-in', {
      image: constants.index.image,
      description: constants.index.description,
      title: constants.index.title,
      type: constants.index.type,
      url: constants.index.url,
      user_id: req.session.user ? req.session.user._id : '',
      user_name: req.session.user ? req.session.user.name : '',
      user: req.session.user ? req.session.user : '',
      app_id: process.env.ACCOUNT_KIT_APP_ID
    })
  }
})

router.get('/sign-up', async (req, res) => {
  try {
    const token = AuthService.getTokenFromRequest(req)
    await AuthService.verifyJWTToken(token)
    return res.redirect('/')
  } catch (error) {
    return res.render('share/sign-up', {
      image: constants.index.image,
      description: constants.index.description,
      title: constants.index.title,
      type: constants.index.type,
      url: constants.index.url,
      user_id: req.session.user ? req.session.user._id : '',
      user_name: req.session.user ? req.session.user.name : '',
      user: req.session.user ? req.session.user : '',
      GOOGLE_PLACE_KEY: process.env.GOOGLE_PLACE_KEY,
      app_id: process.env.ACCOUNT_KIT_APP_ID
    })
  }
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
    user: req.session.user ? req.session.user : '',
    locationId: req.params.id,
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})

router.get('/post/create', async (req, res) => {
  try {
    const token = AuthService.getTokenFromRequest(req)
    const resolve = await AuthService.verifyJWTToken(token)
    const obj = {
      role: resolve.user.role,
      resource: constants.RESOURCES.POST,
      action: constants.ACTIONS.CREATE,
      owner: true
    }
    await AuthService.checkPermission(obj)
  } catch (error) {
    return res.redirect('/')
  }

  return res.render('post/create', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    GOOGLE_PLACE_KEY: process.env.GOOGLE_PLACE_KEY,
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user: req.session.user ? req.session.user : '',
    _id: req.params.id,
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})

// Truoc code nay ko can dang nhap
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
    user: req.session.user ? req.session.user : '',
    _id: req.params.id,
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user: req.session.user ? req.session.user : '',
    _id: req.params.id,
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user: req.session.user ? req.session.user : '',
    _id: req.params.id,
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user_avatar: req.session.user ? req.session.user.avatar : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
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
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})

router.get('/label', async (req, res) => {
  try {
    const token = AuthService.getTokenFromRequest(req)
    const resolve = await AuthService.verifyJWTToken(token)
    const obj = {
      role: resolve.user.role,
      resource: constants.RESOURCES.POST,
      action: constants.ACTIONS.LABEL,
      owner: true
    }
    await AuthService.checkPermission(obj)
  } catch (error) {
    return res.redirect('/')
  }
  return res.render('post/video-labeling', {
    image: constants.index.image,
    description: constants.index.description,
    title: 'Video Labeling',
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})

router.get('/subscription', (req, res) => {
  return res.render('subscription', {
    image: constants.index.image,
    description: constants.index.description,
    title: 'Subscription',
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})
// Sau code nay la cua admin
router.get('/*', async (req, res, next) => {
  try {
    const token = AuthService.getTokenFromRequest(req)
    const resolve = await AuthService.verifyJWTToken(token)
    if (resolve.user.role === 999) {
      return next()
    }
    return res.redirect('/')
  } catch (error) {
    return res.redirect('/')
  }
})

router.get('/admin', (req, res) => {
  return res.render('admin', {
    image: constants.index.image,
    description: constants.index.description,
    title: 'Admin Dashboard',
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.session.user ? req.session.user._id : '',
    user_name: req.session.user ? req.session.user.name : '',
    user_avatar: req.session.user ? req.session.user.avatar : '',
    user: req.session.user ? req.session.user : '',
    app_id: process.env.ACCOUNT_KIT_APP_ID
  })
})

module.exports = router
