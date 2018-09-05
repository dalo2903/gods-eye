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
}

module.exports = new LocationController()
