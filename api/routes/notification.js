
const express = require('express')
let router = express.Router()
// const multer = require('multer')

const NotificationController = require('../controllers/NotificationController')

router.get('/:id', async (req, res) => {
  try {
    const response = await NotificationController.getNotification(req.params.id)
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
