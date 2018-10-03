const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const VisualData = mongoose.model('VisualData')
const responseStatus = require('../../configs/responseStatus')

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
    visualData.identifyResult['persons'] = identifyResult
    // console.log(`updateIdentifyResult : ${identifyResult}`)
    await visualData.save()
  }
  async updateUrl (_id, URL) {
    let visualData = await this.get(_id)
    visualData.URL = URL
    await visualData.save()
  }
  async getAllVideoWithLabel (minLabel) {
    let index = `labels.${minLabel}`
    let visualDatas = await VisualData.find({
      [index]: {$exists: true},
      isImage: false
    })
    return visualDatas
  }

  async getAllVideoNotLabeledByUser (userId, skip, limit) {
    let visualDatas =
      await VisualData.find({
        'labels.user': { $ne: userId },
        isImage: false
      }).populate('location', 'name address').sort('-createdAt').skip(skip).limit(limit).exec()
    return responseStatus.Response(200, { visualDatas: visualDatas })
  }

  async updateLabel (_id, userId, label) {
    const visualData = await VisualData.findById(_id).where('labels.user').ne(userId)
    if (!visualData) throw responseStatus.Response(404)
    const newLabel = {
      user: userId,
      label: label
    }
    visualData.labels.push(newLabel)
    await visualData.save()
    return responseStatus.Response(200)
  }
}

module.exports = new VisualDataController()
