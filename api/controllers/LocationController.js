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
}

module.exports = new LocationController()
