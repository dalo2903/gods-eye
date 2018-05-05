var express = require('express')
var router = express.Router()
var fs = require('fs')

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage')
var path = require('path')
var syncRequest = require('sync-request')
var request = require('request')

// Your Google Cloud Platform project ID
const projectId = 'centering-dock-194606'

// Creates a client
const storage = new Storage({
  projectId: projectId
})

// The name for the new bucket
const bucketName = 'centering-dock-194606.appspot.com'
const personGroupId = 'test-faces'
const key1 = '21eafac8fbba45c1915edb692bed7f59'
const key2 = '57b4ea63c4b84b66899493eb2cc53ea2'
const khaPersonID = '67ad5f3f-131a-42da-b889-c7fda0c9da70'

const msCognitive = 'https://southeastasia.api.cognitive.microsoft.com'
const faceApiUrl = msCognitive + '/face/v1.0'
const personUrl = faceApiUrl + '/persongroups/' + personGroupId + '/persons'

const imageApi = 'http://storage.googleapis.com/centering-dock-194606.appspot.com/images/'

function createPersonInPersonGroup (personGroupId, person) {
  return new Promise((resolve, reject) => {
    var url = faceApiUrl + '/persongroups/' + personGroupId + '/persons/'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key1
      },
      body: {
        name: person.name,
        userData: person.userData
      },
      json: true
    }
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject({ status: 500, error: err })
      }
      if (res.statusCode === 200) {
        return resolve({ status: res.statusCode, personId: res.body.personId })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
      }
    })
  })
}

router.post('/person-groups/:personGroupId/persons/', (req, res) => {
  const person = {
    name: req.body.name,
    userData: req.body.userData
  }
  createPersonInPersonGroup(req.params.personGroupId, person)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

function addFaceForPerson (personGroupId, personId, faceURL) {
  return new Promise((resolve, reject) => {
    var url = faceApiUrl + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key1
      },
      body: {
        url: faceURL
      },
      json: true
    }
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject({ status: 500, error: err })
      }
      if (res.statusCode === 200) {
        var message = 'Add face (url: ' + faceURL + ') for Person with id' + personId + ' successfully. PersistedFaceId:: ' + res.body.persistedFaceId
        return resolve({ status: res.statusCode, message: message })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
      }
    })
  })
}
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/upload', function (req, res, next) {
  res.render('upload', { title: 'Express' })
})

router.post('/person-groups/:personGroupId/persons/:personId', (req, res) => {
  addFaceForPerson(req.params.personGroupId, req.params.personId, req.body.url)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

router.post('/upload', function (req, res) {
  if (!req.files) { return res.status(400).send('No files were uploaded.') }
  let sampleFile = req.files.sampleFile
  const pathFile = path.join(__dirname, '/../public/images/', sampleFile.name)
  var timestamp = Date.now()
  var newName = req.body.name + timestamp + path.extname(sampleFile.name)
  sampleFile.mv(pathFile, function (err) {
    if (err) { return res.status(500).send(err) }
    uploadFile(pathFile, newName).then(resolve => {
      // addFaceForPerson()
      return res.status(200).send({message: 'File uploaded!'})
    }).catch(reject => {
      return res.status(500).send({message: 'Google cloud error'})
    })
  })
})

function trainPersonGroup (personGroupId) {
  return new Promise((resolve, reject) => {
    const url = faceApiUrl + '/persongroups/' + personGroupId + '/train'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key1
      },
      json: true
    }
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject({ status: 500, error: err })
      }
      if (res.statusCode === 202) {
        return resolve({ status: res.statusCode })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
      }
    })
  })
}

router.get('/person-groups/:personGroupId/train', function (req, res) {
  trainPersonGroup(req.params.personGroupId)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

function uploadFile (pathFile, fileName) {
  return new Promise((resolve, reject) => {
    storage
      .bucket(bucketName)
      .upload(pathFile, { destination: 'images/' + fileName })
      .then(() => {
        console.log(`${fileName} uploaded to ${bucketName}.`)
        return resolve({fileName: fileName})
      })
      .catch(err => {
        console.error('ERROR:', err)
        return reject(err)
      })
  })
}

router.get('/person-groups/:personGroupId', (req, res) => {
  listAllPersonsInPersonGroup(req.params.personGroupId)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

function listAllPersonsInPersonGroup (personGroupId, start, top) {
  return new Promise((resolve, reject) => {
    var url = faceApiUrl + '/persongroups/' + personGroupId + '/persons/' +
      (start ? '?start=' + start : '') +
      (top ? '?top=' + top : '')
    var options = {
      url: url,
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': key1
      },
      json: true
    }
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject({ status: 500, error: err })
      }
      if (res.statusCode === 200) {
        return resolve({ status: res.statusCode, persons: res.body })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
      }
    })
  })
}

function initPersonInPersonGroup (personGroupId) {
  const array = [
    {
      name: 'Dinh Duy Kha',
      userData: '1411675'
    },
    {
      name: 'Nguyen Khanh Nam',
      userData: '1412374'
    },
    {
      name: 'Vu Minh Tri',
      userData: '1414241'
    },
    {
      name: 'Dao Duy Phat',
      userData: '1412817'
    }
  ]
  array.forEach(person => {
    createPersonInPersonGroup(personGroupId, person)
      .then(resolve => {
        console.log(person.name + ' import successfully, personId: ' + resolve.personId)
      })
      .catch(reject => {
        console.log('err')
      })
  })
}

router.get('/person-groups/:personGroupId/init', (req, res) => {
  initPersonInPersonGroup(req.params.personGroupId)
  return res.status(200)
})

module.exports = router
