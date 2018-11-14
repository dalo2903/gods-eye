const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Location = mongoose.model('Location')
const responseStatus = require('../../configs/responseStatus')

class LocationController extends BaseController {
  constructor () {
    super(Location)
  }

  async getLocations () {
    const locations = await this.getAll()
    return responseStatus.Response(200, { locations: locations })
  }

  async getLocation (locationId) {
    const location = await this.get(locationId)
    return responseStatus.Response(200, { location: location })
  }

  async updateResident (locationId, userId) {
    let location = await this.get(locationId)
    location.userIds.push(userId)
    await location.save()
  }

  async existNearbyLocation (location, maxDistance) {
    let _location = await Location.findOne().near('location', {
      center: location,
      maxDistance: maxDistance
    })
    return _location
  }

  async setSubscriber (_id, userId) {
    let location = await this.get(_id)
    if (!location.subscribers) {
      location.subscribers = []
    }
    let index = location.subscribers.indexOf(userId)
    if (index <= -1) {
      location.subscribers.push(userId)
      location.save()
    }
    return responseStatus.Response(200, {}, responseStatus.SUBSCRIBE_SUCCESSFULLY)
  }

  async removeSubscriber (_id, userId) {
    let location = await this.get(_id)
    if (!location.subscribers) {
      location.subscribers = []
    }
    let index = location.subscribers.indexOf(userId)
    if (index > -1) {
      location.subscribers.splice(index, 1)
      location.save()
    }
    return responseStatus.Response(200, {}, responseStatus.UNSUBSCRIBE_SUCCESSFULLY)
  }

  async getNearbyLocations (_id, maxDistance) {
    let thisLocation = await this.get(_id)
    let locations = await Location.find().near('location', {
      center: thisLocation.location,
      maxDistance: maxDistance
    })
    return locations
  }
  async createLocation (obj) {
    const location = {
      address: obj.address
    }
    await this.create(location)
    return responseStatus.Response(200, {}, responseStatus.CREATE_LOCATION_SUCCESSFULLY)
  }
}

module.exports = new LocationController()
