const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const VisualData = mongoose.model('VisualData')

class VisualDataController extends BaseController {
  constructor () {
    super(VisualData)
  }

  async createVisualData (obj) {
    const _visualData = {
      description: obj.description,
      URL: obj.URL,
      isImage: obj.isImage,
      location: obj.location
    }
    const visualData = await this.create(_visualData)
    return visualData
  }
}

module.exports = new VisualDataController()
