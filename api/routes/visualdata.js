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
var Base64 = {_keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', encode: function (e) { var t = ''; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ''; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ''); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } }t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, 'n'); var t = ''; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ''; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t }}

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
    for (let i in req.files) {
      console.log(i)
      let result = await FaceController.detectFile(req.files[i].data)
      console.log(result)
      for (let face in result) {
        let person = await PersonController.getPersonByMSPersonId(face['faceId'])
        console.log(person)
      }
    }

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
