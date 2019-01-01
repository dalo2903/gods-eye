const express = require('express')
let router = express.Router()
const VisualDataController = require('../controllers/VisualDataController')
const AuthService = require('../services/AuthService')
const DatasetCollector = require('../controllers/DatasetCollector')
const UploadController = require('../controllers/UploadController')
// const PostController = require('../controllers/PostController')
const IdentifyController = require('../controllers/IdentifyController')
// const PersonController = require('../controllers/PersonController')
const constants = require('../../configs/constants')
// const FaceController = require('../controllers/FaceController')
const RecordController = require('../controllers/RecordController')
const responseStatus = require('../../configs/responseStatus')
const EmailController = require('../controllers/EmailController')

// var config = require('../../config')

// const fs = require('fs')
router.get('/label', async (req, res) => {
  try {
    const skip = parseInt(req.query.skip || 0)
    const limit = parseInt(req.query.limit || 10)
    let userId = (await AuthService.isLoggedIn(req)).user._id
    const response = await VisualDataController.getAllVideoNotLabeledByUser(userId, skip, limit)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/labeled', async (req, res) => {
  try {
    const skip = parseInt(req.query.skip || 0)
    const limit = parseInt(req.query.limit || 10)
    const user = (await AuthService.isLoggedIn(req)).user
    if (user.role !== 999) {
      throw responseStatus.Response(403, {}, responseStatus.INVALID_REQUEST)
    }
    const response = await VisualDataController.getAllLabeledVideoByUsers(skip, limit)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.post('/label', async (req, res) => {
  try {
    let userId = (await AuthService.isLoggedIn(req)).user._id
    let visualDataId = req.body.visualData
    let label = req.body.label
    const response = await VisualDataController.updateLabel(visualDataId, userId, label)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/createDataset', async (req, res) => {
  try {
    const response = await DatasetCollector.downloadDataset()
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/', async (req, res) => {
  try {
    return VisualDataController.getUsingDatatable(req, res)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

function unique (a) {
  var seen = {}
  var out = []
  var len = a.length
  var j = 0
  for (var i = 0; i < len; i++) {
    var item = a[i].faceId
    if (seen[item] !== 1) {
      seen[item] = 1
      out[j++] = a[i]
    }
  }
  return out
}

router.post('/classified', async (req, res) => {
  try {
    const info = req.body
    console.log(info)
    if (info.id !== constants.adminInfo.id) {
      throw responseStatus.Response(403, {}, responseStatus.WRONG_EMAIL_OR_PASSWORD)
    }
    const visualData = await VisualDataController.get(info.video_id)
    if (!visualData) {
      throw responseStatus.Response(403, {}, 'Invalid visualData')
    }
    console.log(visualData)
    // let file = {}
    // _data = fs.readFileSync(filePath)
    // let result = await FaceController.detectFile(_data)
    // console.log(result)
    var identifyResult = []
    for (let i in req.files) {
      console.log(i)
      let result = await IdentifyController.analyzeAndProcessFacesFile(req.files[i].data, visualData.location, visualData._id)
      console.log(result)
      identifyResult = identifyResult.concat(result.persons)
    }
    let uniqueResult = unique(identifyResult)
    console.log(uniqueResult)
    VisualDataController.updateIdentifyResult(visualData._id, uniqueResult)
    var listRecord = []
    for (let person in uniqueResult) {
      let record = {
        personId: person._id,
        location: visualData.location,
        data: visualData._id
      }
      let createRecordResult = RecordController.createRecord(record)
      listRecord.push(createRecordResult._id)
    }
    if (info.result !== 'normal') {
      let title = '[ WARNING : A suspicious activity ]'
      const resNotify = await IdentifyController.notifyUsers(visualData.location, listRecord, visualData._id, title)
      const userEmails = resNotify.users.map(e => e.email)
      console.log(userEmails)
      EmailController.sendMail(userEmails, title, visualData.URL)
    }
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.get('/test', async (req, res) => {
  try {
    let title = '[ WARNING : A suspicious activity ]'
    let visualData = await VisualDataController.get('5be55cb092370a73195bb8d0')
    let listRecord = []
    const resNotify = await IdentifyController.notifyUsers(visualData.location, listRecord, visualData._id, title)
    const userEmails = resNotify.users.map(e => e.email)
    console.log(userEmails)
    EmailController.sendMail(userEmails, title, visualData.URL)
    return res.sendStatus(200)
  } catch (error) {
    return res.status(error.status || 500).send(error)
  }
})
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const info = req.body
    // const file = req.body.file
    var analyzeData = []
    req.body.datas = []
    for (let i in req.files) {
      console.log(i)
      // const isImage = req.files[i].type.startsWith('image')
      // console.log(isImage)
      var visualData = await VisualDataController.createVisualData({
        URL: 'https://vignette.wikia.nocookie.net/mixels/images/f/f4/No-image-found.jpg',
        isImage: true
      })
      console.log(visualData._id)
      const url = await UploadController.uploadFileV3(req.files[i], visualData._id)
      visualData.URL = url
      await visualData.save()
    }
    return res.sendStatus(200)
  } catch (error) {
    // console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
module.exports = router
