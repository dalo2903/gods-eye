var express = require('express')
var router = express.Router()
var faceController = require('../controllers/faceController')

router.post('/detect', (req, res) => {
  faceController.detectFace(req.body.url)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    }
    ).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

module.exports = router
