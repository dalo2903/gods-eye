var request = require('request')
var config = require('../../config')
var responseStatus = require('../../configs/responseStatus')

function detect (urlImage) {
  return new Promise((resolve, reject) => {
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
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject(responseStatus.Response(500, err))
      }
      const status = res.statusCode
      if (status === 200) {
        return resolve(responseStatus.Response(200, { faceIds: res.body }))
      } else {
        return reject(responseStatus.Response(status, { error: res.body.error }))
      }
    })
  })
}

function identify (faceIds, personGroupId) {
  return new Promise((resolve, reject) => {
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
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject(responseStatus.Response(500, err))
      }
      const status = res.statusCode
      if (status === 200) {
        return resolve(responseStatus.Response(status, { faceIds: res.body }))
      } else {
        return reject(responseStatus.Response(status, { error: res.body.error }))
      }
    })
  })
}

function detectAndIdentify (url, personGroupId) {
  return new Promise((resolve, reject) => {
    detect(url).then(resolveDetect => {
      var detectFaceIds = resolveDetect.faceIds
      var identifyFaceIds = []
      console.log(detectFaceIds)
      detectFaceIds.forEach(element => {
        identifyFaceIds.push(element.faceId)
      })
      identify(identifyFaceIds, personGroupId)
        .then(resolveIdentify => {
          return resolve(resolveIdentify)
        }).catch(rejectIdentify => {
          return rejectIdentify
        })
    }).catch(rejectDetect => {
      return rejectDetect
    })
  })
}

function getPersonInfo (personGroupId, personId) {
  return new Promise((resolve, reject) => {
    var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' + personId
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
      },
      json: true
    }
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject(responseStatus.Response(500, err))
      }
      const statusCode = res.statusCode
      if (statusCode === 200) {
        var result = {
          name: res.body.name,
          MSSV: res.body.userData
        }
        return resolve(responseStatus.Response(statusCode, { person: result }))
      } else {
        return reject(responseStatus.Response(statusCode, { error: res.body.error }))
      }
    })
  })
}
module.exports = {
  detect: detect,
  identify: identify,
  detectAndIdentify: detectAndIdentify,
  getPersonInfo: getPersonInfo
}
