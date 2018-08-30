const BaseController = require('./BaseController')
var responseStatus = require('../../configs/responseStatus')

var Person = require('../../models/Person')
var constants = require('../../configs/constants')
var FaceController = require('./FaceController')
var RecordController = require('./RecordController')

class IdentifyController extends BaseController {
  constructor () {
    super(Person)
  }
  async analyzeFace (url) {
    var knownFaceRes = await this.checkKnownFace(url)
    console.log(knownFaceRes[0].candidates)
    var infoRes = await FaceController.getPersonInfo(constants.face.known, knownFaceRes[0].candidates[0].personId)
    console.log(infoRes)
  }

  async checkKnownFace (url) {
    const res = await FaceController.detectAndIdentify(url, constants.face.known)
    return res
  }

  async checkUnknownFace (url) {
    const res = await FaceController.detectAndIdentify(url, constants.face.unknown)
    return res
  }
  async calculateScore (personId) {

  }
}
module.exports = new IdentifyController()
