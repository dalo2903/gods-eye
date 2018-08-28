const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Record = mongoose.model('Record')
const rpn = require('request-promise-native')
var config = require('../../config')
const responseStatus = require('../../configs/responseStatus')

class RecordController extends BaseController {
  constructor () {
    super(Record)
  }

  async createRecord (obj, uuid) {
    let record = {
      uuid: uuid,
      personid: obj.personid,
      location: obj.location,
      datas: obj.datas
    }
    record = await this.create(record)
    return record
  }
}

module.exports = new RecordController()
