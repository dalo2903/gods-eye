const BaseController = require('./BaseController')
var responseStatus = require('../../configs/responseStatus')

var Person = require('../../models/Person')
var constants = require('../../configs/constants')
var FaceController = require('./FaceController')

class IdentifyController extends BaseController {
  constructor () {
    super(Person)
  }
  async analyzeFace (url) {
    var knownFaceRes = await this.checkKnownFace(url)
    console.log(knownFaceRes)
  }

  async checkKnownFace (url) {
    const res = await FaceController.detectAndIdentify(url, constants.face.known)
    return res
  }

  async checkUnknownFace (url) {
    const res = await FaceController.detectAndIdentify(url, constants.face.unknown)
    return res
  }
}
module.exports = new IdentifyController()
