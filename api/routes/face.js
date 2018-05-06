var express = require('express')
var router = express.Router()
var faceController = require('../controllers/faceController')

router.post('/detect', (req, res) => {
  faceController.detect(req.body.url)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    }
    ).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

router.post('/identify', (req, res) => {
  faceController.identify(req.body.faceIds, req.body.personGroupId)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    })
    .catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

module.exports = router
