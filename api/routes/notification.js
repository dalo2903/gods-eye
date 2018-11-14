
const express = require('express')
let router = express.Router()
const AuthService = require('../services/AuthService')
// const multer = require('multer')

const NotificationController = require('../controllers/NotificationController')

router.get('/', async (req, res) => {
  try {
    const userId = (await AuthService.isLoggedIn(req)).user._id
    const response = await NotificationController.getNotification(userId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/setSeen/:id', async (req, res) => {
  try {
    const response = await NotificationController.updateNotificationSeen(req.params.id)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
