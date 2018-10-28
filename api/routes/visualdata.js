const express = require('express')
let router = express.Router()
const VisualDataController = require('../controllers/VisualDataController')
const AuthService = require('../services/AuthService')
const DatasetCollector = require('../controllers/DatasetCollector')

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

module.exports = router
