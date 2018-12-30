const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Location = mongoose.model('Location')
const responseStatus = require('../../configs/responseStatus')
const dateFormat = require('dateformat')
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

  async getUsingDatatable (req, res) {
    Location.dataTables({
      limit: req.query.length,
      skip: req.query.start,
      order: req.query.order,
      columns: req.query.columns,
      search: {
        value: req.query.search.value,
        fields: ['name', 'address']
      },
      formatter: function (location) {
        return {
          name: location.name,
          address: location.address,
          createdAt: dateFormat(new Date(location.createdAt), 'HH:MM dd/mm/yyyy')
        }
      }
    }).then((table) => {
      table.recordsFiltered = table.total
      table.recordsTotal = table.total
      res.json(table)
    }).catch((err) => {
      console.log(err)
      res.json([])
    })
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
    }).populate({ path: 'subscribers', select: 'email', model: 'User' }).exec()
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
