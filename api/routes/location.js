const express = require('express')
let router = express.Router()
const AuthService = require('../services/AuthService')
const constants = require('../../configs/constants')
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

router.get('/:locationId', async (req, res) => {
  try {
    const locationId = req.params.locationId
    const response = await LocationController.getLocation(locationId)
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

router.post('/', async (req, res) => { // Tao location
  try {
    const user = (await AuthService.isLoggedIn(req)).user
    const obj = {
      role: user.role,
      resource: constants.RESOURCES.LOCATION,
      action: constants.ACTIONS.CREATE,
      owner: true
    }
    await AuthService.checkPermission(obj)
    const response = await LocationController.createLocation(req.body)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
