const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const LocalScore = mongoose.model('LocalScore')
// var config = require('../../config')
const responseStatus = require('../../configs/responseStatus')

class LocalScoreController extends BaseController {
  constructor () {
    super(LocalScore)
  }

  async createLocalScore (obj) {
    let LocalScore = {
      personid: obj.personid,
      location: obj.location,
      score: obj.score
    }
    LocalScore = await this.create(LocalScore)
    return LocalScore
  }
  async updateScore (_id, score) {
    let localScore = await this.get(_id)
    localScore.score = score
    await localScore.save()
  }
  async getLocalScoreByPersonIdAndLocation (personId, location) {
    const localScore = await LocalScore.find({personId: personId, location: location})
    if (!localScore) return responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, {localScore: localScore})
  }
  async getLocalScoreByPersonId (personId) {
    const localScore = await LocalScore.find({personId: personId})
    if (!localScore) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, {localScore: localScore})
  }
  async getLocalScoreByLocation (location) {
    const localScore = await LocalScore.find({location: location})
    if (!localScore) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, {localScore: localScore})
  }
}

module.exports = new LocalScoreController()
