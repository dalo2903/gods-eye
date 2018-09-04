var request = require('request')
var config = require('../../config')
const rpn = require('request-promise-native')

var responseStatus = require('../../configs/responseStatus')
var Person = require('../../models/Person')

// function detect (urlImage) {
//   return new Promise((resolve, reject) => {
//     var url = config.microsoft.face + '/detect?returnFaceId=true'
//     var options = {
//       url: url,
//       method: 'POST',
//       headers: {
//         'Ocp-Apim-Subscription-Key': config.microsoft.key1
//       },
//       body: {
//         url: urlImage
//       },
//       json: true
//     }
//     request(options, (err, res) => {
//       if (err) {
//         console.log(err)
//         return reject(responseStatus.Response(500, err))
//       }
//       const status = res.statusCode
//       if (status === 200) {
//         return resolve(responseStatus.Response(200, { faceIds: res }))
//       } else {
//         return reject(responseStatus.Response(status, { error: res.error }))
//       }
//     })
//   })
// }
class FaceController {
  async detect (urlImage) {
    var url = config.microsoft.face + '/detect?returnFaceId=true'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      body: {
        url: urlImage
      },
      json: true
    }
    try {
      const res = await rpn(options)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when detect face')
    }
  }

  // function identify (faceIds, personGroupId) {
  //   return new Promise((resolve, reject) => {
  //     var url = config.microsoft.face + '/identify'
  //     var options = {
  //       url: url,
  //       method: 'POST',
  //       headers: {
  //         'Ocp-Apim-Subscription-Key': config.microsoft.key1
  //       },
  //       body: {
  //         faceIds: faceIds,
  //         personGroupId: personGroupId
  //       },
  //       json: true
  //     }
  //     request(options, (err, res) => {
  //       if (err) {
  //         console.log(err)
  //         return reject(responseStatus.Response(500, err))
  //       }
  //       const status = res.statusCode
  //       if (status === 200) {
  //         return resolve(responseStatus.Response(status, { faceIds: res }))
  //       } else {
  //         return reject(responseStatus.Response(status, { error: res.error }))
  //       }
  //     })
  //   })
  // }

  async identify (faceIds, personGroupId) {
    var url = config.microsoft.face + '/identify'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      body: {
        faceIds: faceIds,
        personGroupId: personGroupId
      },
      json: true
    }
    try {
      const res = await rpn(options)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when identifying face')
    }
  }

  // function detectAndIdentify (url, personGroupId) {
  //   return new Promise((resolve, reject) => {
  //     detect(url).then(resolveDetect => {
  //       var detectFaceIds = resolveDetect.faceIds
  //       var identifyFaceIds = []
  //       console.log(detectFaceIds)
  //       detectFaceIds.forEach(element => {
  //         identifyFaceIds.push(element.faceId)
  //       })
  //       identify(identifyFaceIds, personGroupId)
  //         .then(resolveIdentify => {
  //           return resolve(resolveIdentify)
  //         }).catch(rejectIdentify => {
  //           return rejectIdentify
  //         })
  //     }).catch(rejectDetect => {
  //       return rejectDetect
  //     })
  //   })
  // }

  async detectAndIdentify (url, personGroupId) {
    var detectFaceIds = await this.detect(url)
    var identifyFaceIds = []
    // console.log(detectFaceIds)
    detectFaceIds.forEach(element => {
      identifyFaceIds.push(element.faceId)
    })
    if (detectFaceIds.length !== 0) {
      var identifyRes = await this.identify(identifyFaceIds, personGroupId)
      var detectMap = {}
      detectFaceIds.forEach(function (face) {
        detectMap[face.faceId] = face.faceRectangle
      })
      // console.log(detectMap)
      identifyRes.forEach(function (face) {
        face.faceRectangle = detectMap[face.faceId]
      })
      // console.log(identifyRes)
      return identifyRes
    }
  }

  async createPersonGroup (personGroupId, group) {
    var url = config.microsoft.face + '/persongroups/' + personGroupId
    var options = {
      url: url,
      method: 'PUT',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      body: {
        name: group.name,
        userData: group.userData
      },
      json: true
    }
    try {
      const res = await rpn(options)
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when detect face')
    }
  }

  async deletePersonGroup (personGroupId) {
    var url = config.microsoft.face + '/persongroups/' + personGroupId
    var options = {
      url: url,
      method: 'DELETE',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when delete person group face')
    }
  }

  async deletePersonInPersonGroup (personGroupId, personId) {
    var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' + personId
    var options = {
      url: url,
      method: 'DELETE',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when delete person face')
    }
  }

  async listPersonGroup () {
    var url = config.microsoft.face + '/persongroups/'
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when detect face')
    }
  }

  async createPersonInPersonGroup (personGroupId, person) {
    const url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/'
    const options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      body: {
        name: person.name,
        userData: person.userData
      },
      json: true
    }
    try {
      const res = await rpn(options)
      //console.log(res)
      console.log(`Created MS person id = ${res.personId}`)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when create person in person group')
    }
  }

  async addFaceForPerson (personGroupId, personId, faceURL, targetFace) {
    var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces' + (targetFace ? '?' + targetFace : '')
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      body: {
        url: faceURL
      },
      json: true
    }
    try {
      const res = await rpn(options) // persistedFaceId
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when add face for person')
    }
  }
  async getPersonInfo (personGroupId, personId) {
    var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' + personId
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options) // persistedFaceId
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when add face for person')
    }
  }

  async trainPersonGroup (personGroupId) {
    const url = config.microsoft.face + '/persongroups/' + personGroupId + '/train'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options) // persistedFaceId
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when training person group')
    }
  }
  async getTrainingStatus (personGroupId) {
    const url = config.microsoft.face + '/persongroups/' + personGroupId + '/training'
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options) // persistedFaceId
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when getting training status of person group')
    }
  }
  async getPersonGroup (personGroupId) {
    const url = config.microsoft.face + '/persongroups/' + personGroupId
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options) // persistedFaceId
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when getting person group')
    }
  }

  async getPersonsInPersonGroup (personGroupId) {
    const url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons'
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    try {
      const res = await rpn(options) // persistedFaceId
      console.log(res)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when getting person')
    }
  }
}
module.exports = new FaceController()
