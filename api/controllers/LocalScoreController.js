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
    let _localScore = {
      personId: obj.personid,
      location: obj.location,
      rate: obj.rate,
      score: obj.score
    }
    const localScore = await this.create(_localScore)
    console.log(`Created new local score id = ${localScore._id}`)
    return localScore
  }
  async updateScore (_id, score) {
    let localScore = await this.get(_id)
    localScore.score = score
    await localScore.save()
  }
  async updateRate (_id, rate) {
    let localScore = await this.get(_id)
    localScore.rate = rate
    await localScore.save()
  }
  async getLocalScoreByPersonIdAndLocation (personId, location) {
    const localScore = await LocalScore.findOne({personId: personId, location: location})
    return localScore
  }
  async getLocalScoreByPersonId (personId) {
    const localScore = await LocalScore.findOne({personId: personId})
    return localScore
  }
  async getLocalScoreByLocation (location) {
    const localScore = await LocalScore.findOne({location: location})
    return localScore
  }
}

module.exports = new LocalScoreController()
