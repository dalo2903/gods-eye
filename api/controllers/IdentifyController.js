var responseStatus = require('../../configs/responseStatus')

// var Person = require('../../models/Person')
var constants = require('../../configs/constants')
var FaceController = require('./FaceController')
// var RecordController = require('./RecordController')
var PersonController = require('./PersonController')
var LocalScoreController = require('./LocalScoreController')
var RelationshipController = require('./RelationshipController')
var VisualDataController = require('./VisualDataController')

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

  async analyzeAndProcessFaces (url, location) {
    var response = []
    const detectRes = await FaceController.detect(url)
    var identifyFaceIds = []
    detectRes.forEach(element => {
      identifyFaceIds.push(element.faceId)
    })
    if (identifyFaceIds.length !== 0) {
      var identifyRes = await this.identify(identifyFaceIds, constants.face.known)
      var detectMap = {}
      detectRes.forEach(function (face) {
        detectMap[face.faceId] = face.faceRectangle
      })
      identifyRes.forEach(function (face) {
        face.faceRectangle = detectMap[face.faceId]
      })
      for (let element of identifyRes) {
        if (element.candidates.length !== 0) {
          if (element.candidates[0].confidence >= 0.5) {
            var person = (await PersonController.getPersonByMSPersonId(element.candidates[0].personId)).person
            response.push({
              faceId: element.faceId,
              personId: person._id,
              confidence: element.candidates[0].confidence,
              facerectangle: element.faceRectangle
            })
          } else {
            // Create new person
            let newMSPerson = {
              name: constants.name.unknown,
              userData: constants.name.unknown
            }
            const createMSPersonRes = await FaceController.createPersonInPersonGroup(constants.face.known, newMSPerson)
            let targetFace = 'targetFace=' + element.faceRectangle.left + ',' + element.faceRectangle.top + ',' + element.faceRectangle.width + ',' + element.faceRectangle.height
            await FaceController.addFaceForPerson(constants.face.known, createMSPersonRes.personId, url, targetFace)
            const visualData = await VisualDataController.createVisualData({
              URL: url,
              isImage: true,
              location: location
            })
            let newPerson = {
              mspersonid: createMSPersonRes.personId,
              name: constants.name.unknown,
              isknown: false,
              datas: [visualData]
            }
            const createPersonRes = await PersonController.createPerson(newPerson, constants.adminInfo.id)
            response.push({
              faceId: element.faceId,
              personId: createPersonRes._id,
              isNew: true,
              facerectangle: element.faceRectangle
            })
          }
        }
      }
    } else return responseStatus.Response(404, {}, 'DEO THAY MAT')
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
