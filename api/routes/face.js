const express = require('express')
let router = express.Router()
// const multer = require('multer')
const Constants = require('../../configs/constants')
const AuthService = require('../services/AuthService')
const PersonController = require('../controllers/PersonController')
const FaceController = require('../controllers/FaceController')
const UploadController = require('../controllers/UploadController')
const VisualDataController = require('../controllers/VisualDataController')

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

router.get('/person/create/:persongroupid/:name/:urlimage', async (req, res) => {
  try {
    const personGroupId = req.params.persongroupid
    const name = req.params.name
    const urlImage = req.params.urlImage

    const visualData = await VisualDataController.createVisualData({
      URL: urlImage,
      isImage: true
    })
    const request = {
      name: name,
      datas: [visualData._id]
    }
    const person = await PersonController.createPerson(request, 'CMo8CqLzzBXn19GSCcEuNnHJYhq1')
    res.send()
    const personId = await (FaceController.createPersonInPersonGroup(personGroupId, {name: name})).personId
    await FaceController.addFaceForPerson(personGroupId, personId, urlImage) // Add face in face api
    await PersonController.updateMicrosoftPersonId(person._id, personId) // Update MSid in DB
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

router.get('/persongroup/:persongroupid/delete/:personid', async (req, res) => {
  try {
    const personId = req.params.personid
    const personGroupId = req.params.persongroupid
    const response = await FaceController.deletePersonInPersonGroup(personGroupId, personId)
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
    await AuthService.isLoggedIn(req)
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
    const response = await FaceController.getPersonsInPersonGroup(id)
    console.log(response)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
