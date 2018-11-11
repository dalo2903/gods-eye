const express = require('express')
let router = express.Router()
const VisualDataController = require('../controllers/VisualDataController')
const AuthService = require('../services/AuthService')
const DatasetCollector = require('../controllers/DatasetCollector')
const UploadController = require('../controllers/UploadController')
const PostController = require('../controllers/PostController')
const IdentifyController = require('../controllers/IdentifyController')
const PersonController = require('../controllers/PersonController')
const constants = require('../../configs/constants')
const FaceController = require('../controllers/FaceController')
const responseStatus = require('../../configs/responseStatus')
var config = require('../../config')

const fs = require('fs')
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

function unique(a) {
  var seen = {}
  var out = []
  var len = a.length
  var j = 0
  for (var i = 0; i < len; i++) {
    var item = a[i]._id
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

    // const file = req.body.file
    // var analyzeData = []

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
    var identifyResult = [];
    for (let i in req.files) {
      console.log(i)
      let result = await IdentifyController.analyzeAndProcessFacesFile(req.files[i].data, visualData.location, visualData._id)
      console.log(result)
      identifyResult.concat(result)
    }
    console.log(identifyResult)

    // const isImage = req.files[i].type.startsWith('image')
    // console.log(isImage)
    // var visualData = await VisualDataController.createVisualData({
    //   URL: 'https://vignette.wikia.nocookie.net/mixels/images/f/f4/No-image-found.jpg',
    //   isImage: true
    // })
    // console.log(visualData._id)
    // const url = await UploadController.uploadFileV3(req.files[i], visualData._id)
    // // visualData.URL = url
    // await visualData.save()
    // req.body.datas.push(visualData._id)
    //   analyzeData.push({
    //     url: url,
    //     id: visualData._id
    //   })
    // }
    // req.body.title = 'Suspicious behaviour detected'
    // req.body.location = location
    // for (let data of analyzeData) {
    //   const analyzeAndProcessResponse = await IdentifyController.analyzeAndProcessFaces(data.url, location, post._id, data.id)
    //   console.log(analyzeAndProcessResponse.persons)
    //   await VisualDataController.updateIdentifyResult(data.id, analyzeAndProcessResponse.persons)

    return res.sendStatus(200)
  } catch (error) {
    // console.log(error)
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
