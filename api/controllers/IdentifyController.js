var responseStatus = require('../../configs/responseStatus')

// var Person = require('../../models/Person')
var constants = require('../../configs/constants')
var FaceController = require('./FaceController')
// var RecordController = require('./RecordController')
var PersonController = require('./PersonController')
var LocalScoreController = require('./LocalScoreController')
var RelationshipController = require('./RelationshipController')

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
    const localScoreResponse = await LocalScoreController.getLocalScoreByPersonIdAndLocation(personId, location)
    const relationship = await RelationshipController.getRelationship(personId, location)
    // Nếu chưa tồn tại thì tạo mới không thì update
    if (localScoreResponse.status === 404) {
      let localScore = {
        personid: personId,
        location: location
      }
      if (!relationship || relationship.type === constants.relationshipEnum.STRANGER) {
        localScore.score = 10 // Todo:
      }
      if (relationship.type === constants.relationshipEnum.FRIEND) {
        localScore.score = 50 // Todo:
      }
      await LocalScoreController.createLocalScore(localScore)
    } else {
      let score = localScoreResponse.localScore.score
      if (relationship.type === constants.relationshipEnum.STRANGER) {
        score -= 10 // Todo
      }
      if (relationship.type === constants.relationshipEnum.FRIEND) {
        score -= 4 // TODO
      }
      await LocalScoreController.updateScore(localScoreResponse.localScore._id, score) // TODOS
    }
  }
}

module.exports = new IdentifyController()
