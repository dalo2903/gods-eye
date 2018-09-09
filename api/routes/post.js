const express = require('express')
let router = express.Router()
// const multer = require('multer')
const AuthService = require('../services/AuthService')
const PostController = require('../controllers/PostController')
const UploadController = require('../controllers/UploadController')
const VisualDataController = require('../controllers/VisualDataController')
const IdentifyController = require('../controllers/IdentifyController')
const RecordController = require('../controllers/RecordController')
const LocalScoreController = require('../controllers/LocalScoreController')
// const m = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024 // no larger than 5mb
//   }
// })

// IdentifyController.probNormalize(parseFloat(0.6), parseFloat(0.5), parseFloat(0.65)).then(function (abc) {
//   console.log(abc)
// })
/* Create Post */
router.post('/', /* m.single('file'), */ async (req, res) => {
  try {
    // const session = AuthService.getSessionFromRequest(req)
    // const uuid = await AuthService.isLoggedIn(session)
    const userCreated = (await AuthService.isLoggedIn(req)).user._id
    const url = await UploadController.uploadFile(req)
    const location = req.body.location
    const visualData = await VisualDataController.createVisualData({
      URL: url,
      isImage: true,
      location: location
    })
    req.body.datas = [visualData._id]
    const post = await PostController.createPost(req.body, userCreated)
    res.send()
    // console.log(post)
    const analyzeAndProcessResponse = await IdentifyController.analyzeAndProcessFaces(url, location, post._id, visualData._id)
    console.log(analyzeAndProcessResponse)
    await VisualDataController.updateIdentifyResult(visualData._id, analyzeAndProcessResponse)
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
    const skip = parseInt(req.query.skip || 0)
    const limit = parseInt(req.query.limit || 10)
    const response = await PostController.getPostsPopulateAuthor(skip, limit)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
