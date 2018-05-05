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

function submitFace (personId, imageBinary) {
  return new Promise((resolve, reject) => {
    var url = faceApiUrl + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key1
      },
      body: {
        url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&h=350'
      },
      json: true
    }
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      if (res.statusCode === 200) {
        var faceUrl = ''
        var message = 'SUCCESS - Submit image' + faceUrl + 'for person id' + personId + '. PersistedFaceId:: ' + res.body.persistedFaceId
        return resolve({ message: message })
      } else {
        console.log(res.body.error)
        return reject(res.body.error)
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

router.get('/submitFace', (req, res) => {
  submitFace(khaPersonID)
    .then(resolve => {
      return res.status(200).send(resolve.messagae)
    }).catch(reject => {
      return res.status(500)
    })
})

router.post('/upload', function (req, res) {
  if (!req.files) { return res.status(400).send('No files were uploaded.') }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile
  // Use the mv() method to place the file somewhere on your server
  const pathFile = path.join(__dirname, '/../public/images/', sampleFile.name)
  var timestamp = Date.now()
  var newName = req.body.name + timestamp + path.extname(sampleFile.name)

  var buf = Buffer.from(sampleFile.data)
  submitFace(khaPersonID, buf)

  sampleFile.mv(pathFile, function (err) {
    if (err) { return res.status(500).send(err) }
    uploadFile(pathFile, newName)
    //
    var uploadedImage = imageApi + newName
    console.log(uploadedImage)
    res.send('File uploaded! Name = ' + newName)
  })
})

function trainPersonGroup (personGroupId) {
  console.log(personGroupId)
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
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Name of a bucket, e.g. my-bucket';
  // const filename = 'Local file to upload, e.g. ./local/path/to/file.txt';

  // Uploads a local file to the bucket
  storage
    .bucket(bucketName)
    .upload(pathFile, { destination: 'images/' + fileName })
    .then(() => {
      console.log(`${fileName} uploaded to ${bucketName}.`)
    })
    .catch(err => {
      console.error('ERROR:', err)
    })
  // [END storage_upload_file]
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

module.exports = router
