// var express = require('express')
// var router = express.Router()
// var personController = require('../controllers/personController')

// router.post('/', (req, res) => {
//   // const person = {
//   //   name: req.body.name,
//   //   userData: req.body.userData
//   // }
//   // personController.createPersonInPersonGroup('test-faces', person)
//   //   .then(resolve => {
//   //     // saveUserToDatabase(person.userData, resolve.person)
//   //     return res.status(resolve.status).send(resolve)
//   //   }).catch(reject => {
//   //     return res.status(reject.status).send(reject)
//   //   })
  
// })
const express = require('express')
let router = express.Router()
const multer = require('multer')
const AuthService = require('../services/AuthService')
const PersonController = require('../controllers/PersonController1')
const UploadController = require('../controllers/UploadController')
const VisualDataController = require('../controllers/VisualDataController')

const m = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
})

router.post('/', /* m.single('file'), */ async (req, res) => {
  try {
    const session = AuthService.getSessionFromRequest(req)
    const uuid = await AuthService.isLoggedIn(session)
    const url = await UploadController.uploadFile(req)
    const visualData = await VisualDataController.createVisualData({
      URL: url,
      isImage: true
    })
    req.body.datas = [visualData._id]
    console.log(req.body)
    await PersonController.createPerson(req.body, uuid)
    return res.send()
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
