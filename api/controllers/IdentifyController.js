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
    var knownFaceIds = await this.checkKnownFace(url)
    console.log(knownFaceIds)
    var unknownFaceIds = await this.checkUnknownFace(url)
    console.log(unknownFaceIds)
  }

  async checkKnownFace (url) {
    const faceIds = await FaceController.detectAndIdentify(url, constants.face.known)
    faceIds.forEach(element => {
      console.log(element.candidates)
    })
    return faceIds
  }

  async checkUnknownFace (url) {
    const faceIds = await FaceController.detectAndIdentify(url, constants.face.unknown)
    faceIds.forEach(element => {
      console.log(element.candidates)
    })
    return faceIds
  }
}
module.exports = new IdentifyController()
