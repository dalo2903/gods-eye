const BaseController = require('./BaseController')
var responseStatus = require('../../configs/responseStatus')

var Person = require('../../models/Person')
var constants = require('../../configs/constants')
var FaceController = require('./FaceController')
var RecordController = require('./RecordController')
var PersonController = require('./PersonController')

class IdentifyController extends BaseController {
  constructor () {
    super(Person)
  }
  async analyzeFace (url) {
    var knownFaceRes = await this.checkKnownFace(url)
    var unknownFaceRes = await this.checkUnknownFace(url)
    var persons = []
    for(let element of knownFaceRes){
      if(element.candidates.length !== 0){
        if(element.candidates[0].confidence >= 0.5){
          var person = (await PersonController.getPersonByMSPersonId(element.candidates[0].personId)).person
          persons.push({
            person: person._id,
            confidence: element.candidates[0].confidence,
            facerectangle: element.faceRectangle
          })
        }
      }      
    }
    for(let element of unknownFaceRes){
      if(element.candidates.length !== 0){
        if(element.candidates[0].confidence >= 0.5){
          var person = (await PersonController.getPersonByMSPersonId(element.candidates[0].personId)).person
          persons.push({
            person: person._id,
            confidence: element.candidates[0].confidence,
            facerectangle: element.faceRectangle
          })
        }
      }
    }
    for(let element of persons){
      console.log(element)
    }
    return persons
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
