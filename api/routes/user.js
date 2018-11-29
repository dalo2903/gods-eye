const express = require('express')
let router = express.Router()
const PostController = require('../controllers/PostController')
const NotificationController = require('../controllers/NotificationController')
const AuthService = require('../services/AuthService')
const UserController = require('../controllers/UserController')

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
module.exports = router
