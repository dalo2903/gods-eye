const express = require('express')
let router = express.Router()
const multer = require('multer')
const AuthService = require('../services/AuthService')
const PostController = require('../controllers/PostController')
const UploadController = require('../controllers/UploadController')
const VisualDataController = require('../controllers/VisualDataController')
const IdentifyController = require('../controllers/IdentifyController')

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
      isImage: true,
      location: req.body.location
    })
    req.body.datas = [visualData._id]
    console.log(req.body)
    await PostController.createPost(req.body, uuid)
    const identifyResponse = await IdentifyController.analyzeFace(url)
    console.log(identifyResponse)
    return res.send()
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const response = await PostController.getPost(id)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/', async (req, res) => {
  try {
    const response = await PostController.getPostsPopulateAuthor()
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
