const express = require('express')
let router = express.Router()
// const multer = require('multer')
const Constants = require('../../configs/constants')
const AuthService = require('../services/AuthService')
const PersonController = require('../controllers/PersonController')
const FaceController = require('../controllers/FaceController')
const UploadController = require('../controllers/UploadController')
const VisualDataController = require('../controllers/VisualDataController')

// const m = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024 // no larger than 5mb
//   }
// })

router.post('/add-face', async (req, res) => {
  try {
    // const session = AuthService.getSessionFromRequest(req)
    // await AuthService.isLoggedIn(session)
    await AuthService.isLoggedIn(req)
    const url = await UploadController.uploadFile(req)
    const visualData = await VisualDataController.createVisualData({
      URL: url,
      isImage: true
    })
    const response = await PersonController.addDataForPerson(req.body._id, visualData._id)
    res.send(response)
    try {
      const msPersonId = response.person.msPersonId
      await FaceController.addFaceForPerson(Constants.face.known, msPersonId, url) // Add face to mspersonid
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.post('/', /* m.single('file'), */ async (req, res) => {
  try {
    // const session = AuthService.getSessionFromRequest(req)
    // const uuid = await AuthService.isLoggedIn(session)
    const userCreated = (await AuthService.isLoggedIn(req)).user._id
    const url = await UploadController.uploadFile(req)
    const visualData = await VisualDataController.createVisualData({
      URL: url,
      isImage: true
    })
    var person = req.body
    person.datas = [visualData._id]
    person.isKnown = true
    const createPersonRes = await PersonController.createPerson(person, userCreated)
    res.send() // Send response after upload image and create person in database
    const msPersonId = (await FaceController.createPersonInPersonGroup(Constants.face.known, { name: createPersonRes.name })).personId
    await FaceController.addFaceForPerson(Constants.face.known, msPersonId, url) // Add face in face api
    await PersonController.updateMicrosoftPersonId(createPersonRes._id, msPersonId) // Update MSid in DB
    FaceController.trainPersonGroup(Constants.face.known)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const response = await PersonController.getPerson(req.params.id)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/', async (req, res) => {
  try {
    // const session = AuthService.getSessionFromRequest(req)
    // const uuid = await AuthService.isLoggedIn(session)
    const userCreated = (await AuthService.isLoggedIn(req)).user._id
    const response = await PersonController.getPersonsSameAuthor(userCreated)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
