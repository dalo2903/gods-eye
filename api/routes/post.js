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
const constants = require('../../configs/constants')

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
    console.log(req.body)
    const userCreated = (await AuthService.isLoggedIn(req)).user._id
    const location = req.body.location
    var analyzeData = []
    for (i = 0; i < req.files.files.length; i++) {
      const isImage = req.files.files[i].mimetype.startsWith('image')
      const visualData = await VisualDataController.createVisualData({
        URL: 'https://vignette.wikia.nocookie.net/mixels/images/f/f4/No-image-found.jpg',
        isImage: isImage,
        location: location
      })
      const url = await UploadController.uploadFileV2(req.files.files[i], visualData._id)
      visualData.URL = url
      await visualData.save()
      req.body.datas.append(visualData._id)
      analyzeData.push({
        url: url,
        id: visualData._id
      })
    }
    const post = await PostController.createPost(req.body, userCreated)
    res.send()
    // console.log(post)
    for (i = 0; i <= analyzeData.length; i++) {
      const analyzeAndProcessResponse = await IdentifyController.analyzeAndProcessFaces(analyzeData[i].url, location, post._id, analyzeData[i].id)
      console.log(analyzeAndProcessResponse.persons)
      await VisualDataController.updateIdentifyResult(analyzeData[i].id, analyzeAndProcessResponse.persons)
    }
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

router.delete('/:id', async (req, res) => { // Xoa post
  try {
    const user = (await AuthService.isLoggedIn(req)).user
    const id = req.params.id
    const post = await PostController.get(id)
    const obj = {
      role: user.role,
      resource: constants.RESOURCES.POST,
      action: constants.ACTIONS.DELETE,
      owner: post.userCreated.toString() === user._id.toString()
    }
    await AuthService.checkPermission(obj)
    const response = await PostController.delete(id)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
