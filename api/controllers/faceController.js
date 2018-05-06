var request = require('request')
var config = require('../../config')
var responseStatus = require('../../configs/responseStatus')

function detectFace (urlImage) {
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
        return resolve({ status: res.statusCode, persons: res.body })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
      }
    })
  })
}

module.exports = {
  detectFace: detectFace
}
