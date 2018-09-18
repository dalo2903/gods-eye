const express = require('express')
let router = express.Router()
const PostController = require('../controllers/PostController')
const NotificationController = require('../controllers/NotificationController')

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

router.get('/:userId/notifications', async (req, res) => {
  try {
    const userId = req.params.userId
    const skip = parseInt(req.query.skip || 0)
    const limit = parseInt(req.query.limit || 10)
    const response = await NotificationController.getUserNotifications(userId, skip, limit)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router