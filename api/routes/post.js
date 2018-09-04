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
    // console.log(req.body)
    const post = await PostController.createPost(req.body, userCreated)
    res.send()
    const identifyResponse = await IdentifyController.analyzeFace(url)
    // console.log(identifyResponse)
    await VisualDataController.updateIdentifyResult(visualData._id, identifyResponse)

    // When there are faces in the picture
    if (identifyResponse.status !== 404) {
      // Create records for the detections
      for (let element of identifyResponse.persons) {
        const record = {
          postId: post._id,
          data: visualData._id,
          personId: element.personId,
          location: location
        }
        RecordController.createRecord(record, post._id)
        const score = await IdentifyController.calculateScore(element.personId, location)
        const localScoreResponse = await LocalScoreController.getLocalScoreByPersonIdAndLocation(element.personId, location)
        if (localScoreResponse.status === 404) {
          const localScore = {
            personId: element.personId,
            location: location,
            score: score
          }
          LocalScoreController.createLocalScore(localScore)
        } else {
          LocalScoreController.updateScore(localScoreResponse.localScore._id, score)
        }
      }
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

module.exports = router
