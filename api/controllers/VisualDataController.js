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
  async updateIdentifyResult (_id, identifyResult) {
    let visualData = await this.get(_id)
    visualData.identifyResult = identifyResult
    await visualData.save()
  }
}

module.exports = new VisualDataController()
