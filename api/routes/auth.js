var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.post('/', (req, res) => {
   authController.testSignIn(req.body.data)
})

module.exports = router
