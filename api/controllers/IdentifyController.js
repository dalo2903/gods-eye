var responseStatus = require('../../configs/responseStatus')

var Person = require('../../models/Person')
var constants = require('../../configs/constants')
var FaceController = require('./FaceController')
var RecordController = require('./RecordController')
var PersonController = require('./PersonController')
// var RecordController = require('./RecordController')

class IdentifyController {
  async analyzeFace (url) {
    var knownFaceRes = await this.checkKnownFace(url)
    var unknownFaceRes = await this.checkUnknownFace(url)
    var persons = []
    for (let element of knownFaceRes) {
      if (element.candidates.length !== 0) {
        if (element.candidates[0].confidence >= 0.5) {
          var personKnown = (await PersonController.getPersonByMSPersonId(element.candidates[0].personId)).person
          persons.push({
            personId: personKnown._id,
            confidence: element.candidates[0].confidence,
            facerectangle: element.faceRectangle
          })
        }
      }
    }
    for (let element of unknownFaceRes) {
      if (element.candidates.length !== 0) {
        if (element.candidates[0].confidence >= 0.5) {
          var personUnknown = (await PersonController.getPersonByMSPersonId(element.candidates[0].personId)).person
          persons.push({
            personId: personUnknown._id,
            confidence: element.candidates[0].confidence,
            facerectangle: element.faceRectangle
          })
        }
      }
    }
    // for (let element of persons) {
    //   console.log(element)
    // }
    if (persons.length === 0) {
      return responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    }
    return responseStatus.Response(200, {persons: persons})
  }

  async checkKnownFace (url) {
    const res = await FaceController.detectAndIdentify(url, constants.face.known)
    return res
  }

  async checkUnknownFace (url) {
    const res = await FaceController.detectAndIdentify(url, constants.face.unknown)
    return res
  }
  async calculateScore (personId, location) {
  }
}
module.exports = new IdentifyController()
