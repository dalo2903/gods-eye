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
        return reject(responseStatus.Code500(err))
      }
      if (res.statusCode === 200) {
        return resolve({ status: res.statusCode, faceIds: res.body })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
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
        return reject(responseStatus.Code500(err))
      }
      if (res.statusCode === 200) {
        return resolve({ status: res.statusCode, faceIds: res.body })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
      }
    })
  })
}

function detectAndIdentify (url, personGroupId) {
  return new Promise((resolve, reject) => {
    detect(url).then(resolveDetect => {
      var detectFaceIds = resolveDetect.faceIds
      var identifyFaceIds = []
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

module.exports = {
  detect: detect,
  identify: identify,
  detectAndIdentify: detectAndIdentify
}
