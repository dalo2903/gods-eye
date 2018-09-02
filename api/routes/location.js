const express = require('express')
let router = express.Router()
const LocationController = require('../controllers/LocationController')
const PostController = require('../controllers/PostController')

router.get('/', async (req, res) => {
  try {
    const response = await LocationController.getLocations()
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:locationId/posts', async (req, res) => {
  try {
    const locationId = req.params.locationId
    const response = await PostController.getPostsByLocation(locationId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
