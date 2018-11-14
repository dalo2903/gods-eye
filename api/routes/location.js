const express = require('express')
let router = express.Router()
const AuthService = require('../services/AuthService')
const constants = require('../../configs/constants')
const LocationController = require('../controllers/LocationController')
const UserController = require('../controllers/UserController')

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

router.get('/:locationId/subscribe', async (req, res) => { // Tao location
  try {
    const userId = (await AuthService.isLoggedIn(req)).user._id
    const locationId = req.params.locationId
    await LocationController.setSubscriber(locationId, userId)
    const response = await UserController.addSubcribedLocation(userId, locationId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.get('/:locationId/unsubscribe', async (req, res) => { // Tao location
  try {
    const userId = (await AuthService.isLoggedIn(req)).user._id
    const locationId = req.params.locationId
    await LocationController.removeSubscriber(locationId, userId)
    const response = await UserController.removeSubcribedLocation(userId, locationId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})
router.post('/create', async (req, res) => {
  try {
    // let location = await Location.findOne().near('location', {
    //     center: obj.place.location,
    //     maxDistance: 10
    //   })
    let location = await LocationController.existNearbyLocation(req.body.place.location, 10)
    /* }){ location: {
        $nearSphere: {
          $geometry: {
            type: obj.place.location.type,
            coordinates: obj.place.location.coordinates
          },
          $minDistance: 10
        }
      }}) */

    if (!location) {
      location = await Location.create(req.body.place)
    }

    // obj.address = location._id
  } catch (error) {

  }
})

module.exports = router
