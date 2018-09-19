var responseStatus = require('../../configs/responseStatus')

// var Person = require('../../models/Person')
var constants = require('../../configs/constants')
var FaceController = require('./FaceController')
// var RecordController = require('./RecordController')
var PersonController = require('./PersonController')
var LocalScoreController = require('./LocalScoreController')
var RelationshipController = require('./RelationshipController')
var VisualDataController = require('./VisualDataController')
var RecordController = require('./RecordController')
var NotificationController = require('./NotificationController')
var LocationController = require('./LocationController')

class IdentifyController {
  async detectAndIdentifyFaces (url) {
    console.log(`detectAndIdentifyFaces: url = ${url}`)
    var response = []
    const detectRes = await FaceController.detect(url)
    var identifyFaceIds = []
    detectRes.forEach(element => {
      identifyFaceIds.push(element.faceId)
    })
    if (identifyFaceIds.length !== 0) {
      var identifyRes = await FaceController.identify(identifyFaceIds, constants.face.known)
      var detectMap = {}
      detectRes.forEach(function (face) {
        detectMap[face.faceId] = face.faceRectangle
      })
      identifyRes.forEach(function (face) {
        face.faceRectangle = detectMap[face.faceId]
      })
      for (let element of identifyRes) {
        if (element.candidates.length !== 0 && element.candidates[0].confidence >= constants.face.IDENTIFYTHRESHOLD) {
          for (let candidate of element.candidates) {
            console.log(`Identified person MSId = ${candidate.personId}`)
            var person = await PersonController.getPersonByMSPersonId(candidate.personId)
            // console.log(person)
            response.push({
              faceId: element.faceId,
              personId: person._id,
              confidence: candidate.confidence,
              facerectangle: element.faceRectangle,
              url: person.datas[0].URL,
              name: person.name
            })
          }
        } else {
          console.log(`Cannot identify person`)
          return responseStatus.Response(200, {persons:[]}, 'CANNOT IDENTIFY PERSON')
        }
      }
      if (response.length !== 0) {
        return responseStatus.Response(200, {persons: response})
      } else return responseStatus.Response(404, {}, 'INTERNAL ERROR')
    } else return responseStatus.Response(404, {}, 'DEO THAY MAT')
  }
  async analyzeAndProcessFaces (url, location, postId, visualDataId) {
    console.log(`analyzeAndProcessFaces: url = ${url}, location = ${location}`)
    var response = []
    const detectRes = await FaceController.detect(url)
    var identifyFaceIds = []
    detectRes.forEach(element => {
      identifyFaceIds.push(element.faceId)
    })
    if (identifyFaceIds.length !== 0) {
      var identifyRes = await FaceController.identify(identifyFaceIds, constants.face.known)
      var detectMap = {}
      detectRes.forEach(function (face) {
        detectMap[face.faceId] = face.faceRectangle
      })
      identifyRes.forEach(function (face) {
        face.faceRectangle = detectMap[face.faceId]
      })
      for (let element of identifyRes) {
        if (element.candidates.length !== 0 && element.candidates[0].confidence >= constants.face.IDENTIFYTHRESHOLD) {
          for (let candidate of element.candidates) {
            console.log(`Identified person MSId = ${candidate.personId}`)
            var person = await PersonController.getPersonByMSPersonId(candidate.personId)
            // console.log(person)
            response.push({
              faceId: element.faceId,
              personId: person._id,
              name: person.name,
              confidence: candidate.confidence,
              facerectangle: element.faceRectangle
            })
            let record = {
              personId: person._id,
              location: location,
              postId: postId,
              data: visualDataId
            }
            const createRecordRes = await RecordController.createRecord(record)
            const normConfidence = await this.probNormalize(candidate.confidence, parseFloat(0.5), parseFloat(0.65))
            this.calculateScore(person._id, location, normConfidence, url)
            if (candidate.confidence >= constants.face.ADDPERSONTHRESHOLD) {
              console.log(`Candidate has confidence >= ${constants.face.ADDPERSONTHRESHOLD}, add to the system`)
              let targetFace = 'targetFace=' + element.faceRectangle.left + ',' + element.faceRectangle.top + ',' + element.faceRectangle.width + ',' + element.faceRectangle.height
              await FaceController.addFaceForPerson(constants.face.known, candidate.personId, url, targetFace)
              await PersonController.addDataForPerson(person._id, visualDataId)
            }
          }
        } else {
          console.log(`Cannot identify person, creating new person`)
          // Create new person
          let newMSPerson = {
            name: constants.name.unknown,
            userData: constants.name.unknown
          }
          const createMSPersonRes = await FaceController.createPersonInPersonGroup(constants.face.known, newMSPerson)
          // console.log(`Created new MS person id = ${createMSPersonRes.personId}`)
          let targetFace = 'targetFace=' + element.faceRectangle.left + ',' + element.faceRectangle.top + ',' + element.faceRectangle.width + ',' + element.faceRectangle.height
          await FaceController.addFaceForPerson(constants.face.known, createMSPersonRes.personId, url, targetFace)
          let newPerson = {
            msPersonId: createMSPersonRes.personId,
            name: constants.name.unknown,
            isKnown: false,
            datas: [visualDataId]
          }
          const createPersonRes = await PersonController.createPerson(newPerson, constants.adminInfo.id)
          response.push({
            faceId: element.faceId,
            personId: createPersonRes._id,
            name: createPersonRes.name,
            isNew: true,
            facerectangle: element.faceRectangle
          })
          let record = {
            personid: createPersonRes._id,
            location: location,
            postId: postId,
            data: visualDataId
          }
          const createRecordRes = await RecordController.createRecord(record)
          this.calculateScore(createPersonRes._id, location, undefined, url)
        }
      }
      FaceController.trainPersonGroup(constants.face.known)
      if (response.length !== 0) {
        return responseStatus.Response(200, {persons: response})
      } else return responseStatus.Response(404, {}, 'INTERNAL ERROR')
    } else return responseStatus.Response(404, {}, 'DEO THAY MAT')
  }

  async probNormalize (confidence, min, max) {
    var norm = await this.normalize(confidence, min, max) * 8 // HARD CODE scale to -4 -> 4
    // console.log('v,min,max' + confidence + min + max)
    console.log('norm:' + norm)

    var sigmoid = Math.exp(norm) / (Math.exp(norm) + 1)
    // var sigmoilNorm = this.normalize(sigmoid,min,max)
    return sigmoid
  }
  async normalize (value, min, max) {
    return (value - ((max + min) / 2)) / (max - min)
  }

  async notifyUsers (location, personId, url) {
    const locationRes = await LocationController.getLocation(location)
    const personRes = await PersonController.getPerson(personId)
    // console.log(personRes)
    // console.log(locationRes)
    // for (let userId in locationRes.location.userIds) {
    let message = `WARNING: a person name: "${personRes.person.name}" is found suspicious near your location ${locationRes.location.address} `
    console.log(message)
    let notification = {
      to: constants.adminInfo.id,
      URL: url,
      title: message
    }
    await NotificationController.createNotification(notification)
    // }
  }
  async calculateScore (personId, location, normConfidence, url) {
    const _normConfidence = parseFloat(normConfidence || 1)
    const localScore = await LocalScoreController.getLocalScoreByPersonIdAndLocation(personId, location)
    const relationship = await RelationshipController.getRelationship(personId, location)
    // Nếu chưa tồn tại thì tạo mới không thì update
    console.log(`calculateScore: personId = ${personId}, location = ${location}`)
    if (!localScore) {
      console.log('localScore not found, creating new localScore')
      let newLocalScore = {
        personid: personId,
        location: location,
        rate: constants.score.DECREASERATE
      }
      switch (relationship.type) {
        case constants.relationshipEnum.FAMILY:
          newLocalScore.score = constants.score.FAMILYBASESCORE // Todo:
          break
        case constants.relationshipEnum.FRIEND:
          newLocalScore.score = constants.score.FRIENDBASESCORE // Todo:
          break
        case constants.relationshipEnum.STRANGER:
        default:
          newLocalScore.score = constants.score.STRANGERBASESCORE // Todo:
          break
      }
      // newLocalScore.score += newLocalScore.rate
      const createLocalScoreRes = await LocalScoreController.createLocalScore(newLocalScore)
    } else {
      console.log(`Found local score id = ${localScore._id}`)
      let rate = localScore.rate || -4
      switch (relationship.type) {
        case constants.relationshipEnum.FAMILY:
          rate *= constants.score.FAMILYRATE // Todo:
          break
        case constants.relationshipEnum.FRIEND:
          rate *= constants.score.FRIENDRATE // Todo:
          break
        case constants.relationshipEnum.STRANGER:
        default:
          rate *= constants.score.STRANGERRATE // Todo:
          break
      }
      // rate *= parseFloat(_normConfidence)
      console.log(_normConfidence)
      let newScore = parseFloat(localScore.score) + (parseFloat(rate) * parseFloat(_normConfidence))
      await LocalScoreController.updateRate(localScore._id, rate)
      console.log(`Updated rate = ${rate}`)
      await LocalScoreController.updateScore(localScore._id, newScore)
      console.log(`Updated score = ${newScore}`)
      if (parseFloat(newScore) < 0) {
        this.notifyUsers(location, personId, url)
      }
    }
  }
}

module.exports = new IdentifyController()
