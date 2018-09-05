const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Record = mongoose.model('Record')
const responseStatus = require('../../configs/responseStatus')

class RecordController extends BaseController {
  constructor () {
    super(Record)
  }

  async createRecord (obj, postId) {
    let _record = {
      postId: postId,
      personId: obj.personId,
      location: obj.location,
      data: obj.data
    }
    const record = await this.create(_record)
    console.log(`Created new record id = ${record._id}`)
    return record
  }

  async getRecordsByLocation (locationId) {
    const record = await Record.find({location: locationId})
    return record
  }
}

module.exports = new RecordController()
