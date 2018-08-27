const express = require('express')
const router = express.Router()

const Constants = require('../../configs/constants')
const AuthService = require('../services/AuthService')
const VisualDataController = require('../controllers/VisualDataController')
const UploadController = require('../controllers/UploadController')
const FaceController = require('../controllers/FaceController')
const PersonController = require('../controllers/PersonController1')

// router.post('/detect', (req, res) => {
//   FaceController.detect(req.body.url)
//     .then(resolve => {
//       return res.status(resolve.status).send(resolve)
//     }
//     ).catch(reject => {
//       return res.status(reject.status).send(reject)
//     })
// })

// router.post('/identify', (req, res) => {
//   FaceController.identify(req.body.faceIds, req.body.personGroupId)
//     .then(resolve => {
//       return res.status(resolve.status).send(resolve)
//     })
//     .catch(reject => {
//       return res.status(reject.status).send(reject)
//     })
// })

router.get('/persongroup/create/:persongroupid/:name/:userdata?', async (req, res) => {
  try {
    const id = req.params.persongroupid
    const name = req.params.name
    const userData = req.params.userdata
    const group = {
      name: name,
      userData: userData
    }
    const response = await FaceController.createPersonGroup(id, group)
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.get('/persongroup/list/', async (req, res) => {
  try {
    const response = await FaceController.listPersonGroup()
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/persongroup/delete/:id', async (req, res) => {
  try {
    const id = req.params.id
    const response = await FaceController.deletePersonGroup(id)
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.post('/face/add/', async (req, res) => {
  try {
    // const session = AuthService.getSessionFromRequest(req)
    // const uuid = await AuthService.isLoggedIn(session)
    const url = await UploadController.uploadFile(req)
    const visualData = await VisualDataController.createVisualData({
      URL: url,
      isImage: true
    })
    req.body.datas = [visualData._id]
    const personId = req.body.personId
    // const person = await PersonController.createPerson(req.body, uuid)
    // res.send() // Send response after upload image and create person in database
    // const personId = (await PersonController.getPerson(req.body.)

    await PersonController.addFaceForPerson(Constants.face.known, personId, url)
    await FaceController.addDataForPerson(personId, visualData._id)

    // await PersonController.updateMicrosoftPersonId(person._id, personId)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.get('/persongroup/train/:persongroupid', async (req, res) => {
  try {
    const id = req.params.persongroupid
    const response = await FaceController.trainPersonGroup(id)
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.get('/persongroup/training/:persongroupid', async (req, res) => {
  try {
    const id = req.params.persongroupid
    const response = await FaceController.getTrainingStatus(id)
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.get('/persongroup/:persongroupid', async (req, res) => {
  try {
    const id = req.params.persongroupid
    const response = await FaceController.getPersonGroup(id)
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.get('/persongroup/:persongroupid/persons', async (req, res) => {
  try {
    const id = req.params.persongroupid
    const response = await FaceController.getPersonInPersonGroup(id)
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
module.exports = router
