var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.get('/popup', (req, res) => {
  authController.signInWithPopup()
})

module.exports = router
