const express = require('express')
let router = express.Router()
const PostController = require('../controllers/PostController')
const NotificationController = require('../controllers/NotificationController')
const AuthService = require('../services/AuthService')
const UserController = require('../controllers/UserController')
const responseStatus = require('../../configs/responseStatus')

const querystring = require('querystring')
const rpn = require('request-promise-native')
const crypto = require('crypto')

router.get('/:userId/posts', async (req, res) => {
  try {
    const userId = req.params.userId
    const response = await PostController.getPostsSameUserCreated(userId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:userId/notifications/seen', async (req, res) => {
  try {
    const userId = (await AuthService.isLoggedIn(req)).user._id
    const response = await NotificationController.seenAllNotifications(userId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:userId/unseenNotifications', async (req, res) => {
  try {
    const userId = req.params.userId
    const skip = parseInt(req.query.skip || 0)
    const limit = parseInt(req.query.limit || 10)
    const response = await NotificationController.getUnseenUserNotifications(userId, skip, limit)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

// Doi thanh post
router.get('/:userId/allNotifications', async (req, res) => {
  try {
    const userId = req.params.userId
    const skip = parseInt(req.query.skip || 0)
    const limit = parseInt(req.query.limit || 10)
    const response = await NotificationController.getAllUserNotifications(userId, skip, limit)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/subscribed', async (req, res) => {
  try {
    const userId = (await AuthService.isLoggedIn(req)).user._id
    // const userId = req.params.userId
    const user = await UserController.getSubcribedLocation(userId)
    const response = {
      subscribed: user.subscribed
    }
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.get('/allUsers', async (req, res) => {
  try {
    const skip = parseInt(req.query.skip || 0)
    const limit = parseInt(req.query.limit || 10)
    const response = await UserController.getAllUsers(skip, limit)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/', async (req, res) => {
  try {
    const response = await UserController.getAllUsers()
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:userId/ban', async (req, res) => {
  try {
    const userId = await req.params.userId
    const response = await UserController.banUser(userId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:userId/unban', async (req, res) => {
  try {
    const userId = await req.params.userId
    const response = await UserController.unbanUser(userId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/profile', async (req, res) => {
  try {
    const userId = (await AuthService.isLoggedIn(req)).user._id
    const user = await UserController.getUserProfile(userId)
    return res.send({ user: user })
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

// router.post('/verify-phone', async (req, res) => {
//   try {
//     const userId = (await AuthService.isLoggedIn(req)).user._id
//     if (req.body.csrf !== userId.toString()) {
//       throw responseStatus.Response(403, {}, responseStatus.INVALID_REQUEST)
//     }
//     await UserController.verifyPhone(userId, req.body.phone)
//     return res.send()
//   } catch (error) {
//     console.log(error)
//     return res.status(error.status || 500).send(error)
//   }
// })

router.post('/verify-phone', async (req, res) => {
  try {
    const userId = (await AuthService.isLoggedIn(req)).user._id

    // CSRF check
    if (req.body.csrf !== userId.toString()) {
      throw responseStatus.Response(403, {}, responseStatus.INVALID_REQUEST)
    }
    var appAccessToken = ['AA', process.env.ACCOUNT_KIT_APP_ID, process.env.ACCOUNT_KIT_APP_SECRET].join('|')
    var params = {
      grant_type: 'authorization_code',
      code: req.body.code,
      access_token: appAccessToken
    }

    const tokenExchangeUrl =
      process.env.ACCOUNT_KIT_TOKEN_EXCHANGE_BASE_URL.replace('{{ACCOUNT_KIT_API_VERSION}}', process.env.ACCOUNT_KIT_API_VERSION) + '?' + querystring.stringify(params)

    let resp = await rpn.get({ url: tokenExchangeUrl, json: true })
    const appSecretProof = crypto.createHmac('sha256', process.env.ACCOUNT_KIT_APP_SECRET).update(resp.access_token).digest('hex')
    const meEndpointUrl = process.env.ACCOUNT_KIT_ME_ENDPOINT_BASE_URL.replace('{{ACCOUNT_KIT_API_VERSION}}', process.env.ACCOUNT_KIT_API_VERSION) + '?access_token=' + resp.access_token + '&appsecret_proof=' + appSecretProof

    resp = await rpn.get({ url: meEndpointUrl, json: true })
    const phone = parseInt(resp.phone.number.replace('+84', ''))
    await UserController.verifyPhone(userId, phone)
    return res.send()
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
