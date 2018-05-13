var express = require('express')
var async = require('async')
var router = express.Router()
var config = require('../config')
const Storage = require('@google-cloud/storage')
var path = require('path')
var request = require('request')
var faceController = require('../api/controllers/faceController')
var admin = require('firebase-admin')
var serviceAccount = require('../centering-dock-194606-firebase-adminsdk-5evpf-eaa7a9e811.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://centering-dock-194606.firebaseio.com/'
})
var db = admin.database()
var imageRef = db.ref('image')
var userRef = db.ref('user')
const storage = new Storage({
  projectId: config.google.projectId
})

// The name for the new bucket
const bucketName = config.google.cloudStorage.bucketName
const imageApi = 'http://storage.googleapis.com/centering-dock-194606.appspot.com/images/'

function createPersonInPersonGroup (personGroupId, person) {
  return new Promise((resolve, reject) => {
    var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/'
    var options = {
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
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject({ status: 500, error: err })
      }
      if (res.statusCode === 200) {
        person.personId = res.body.personId
        return resolve({ status: res.statusCode, person: person })
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
      saveUserToDatabase(person.userData, resolve.person)
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})
function addFaceForPerson (personGroupId, personId, faceURL) {
  return new Promise((resolve, reject) => {
    var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces'
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
  res.render('index', { title: 'Gods Eye', photo: '/favicon.ico' })
})

router.get('/upload', function (req, res, next) {
  res.render('upload', { title: 'Express' })
})

router.get('/identify', function (req, res, next) {
  res.render('identify', { title: 'Identify' })
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
  if (!req.files) { return res.status(400).send({ message: 'No files were uploaded.' }) }
  if (!req.body.id) {
    return res.status(400).send({ message: 'Student ID is empty' })
  }
  let sampleFile = req.files.sampleFile
  const pathFile = path.join(__dirname, '/../public/images/', sampleFile.name)
  // path.extname(sampleFile.name)
  var newName = req.body.id + Date.now() + path.basename(pathFile, path.extname(pathFile))
  sampleFile.mv(pathFile, function (err) {
    if (err) { return res.status(500).send(err) }
    res.status(200).send({ message: 'File uploaded!' })
    uploadFile(pathFile, newName).then(resolve => {
      var image = {
        name: newName,
        location: {
          latitude: 0,
          longitude: 0
        },
        userId: req.body.id
      }
      saveImageToDatabase(image)
      getPersonId(image.userId)
        .then(resolveGetPerson => {
          addFaceForPerson('test-faces', resolveGetPerson.personId, imageApi + image.name)
            .then(resolveAddFace => {
              console.log(resolveAddFace.message)
            }).catch(rejectAddFace => {
              console.log(rejectAddFace.error)
            })
        })
        .catch(rejectGetPerson => {
          console.log(rejectGetPerson)
        })
    }).catch(reject => {
      console.log(reject)
      return res.status(500).send({ message: 'Google cloud error' })
    })
  })
})

router.post('/identify', function (req, res) {
  if (!req.files) { return res.status(400).send({ message: 'No files were uploaded.' }) }
  let sampleFile = req.files.sampleFile
  const pathFile = path.join(__dirname, '/../public/images/', sampleFile.name)
  var newName = Date.now() + path.basename(pathFile, path.extname(pathFile))
  sampleFile.mv(pathFile, function (err) {
    if (err) { return res.status(500).send(err) }
    uploadFile(pathFile, newName).then(resolve => {
      faceController.detectAndIdentify(imageApi + newName, 'test-faces')
        .then(resolve => {
          var personData = []
          // return res.status(resolve.status).send(resolve)
          const faceIds = resolve.faceIds
          async.each(faceIds, (faceId, callback) => {
            if (faceId.candidates.length !== 0) {
              faceController.getPersonInfo('test-faces', faceId.candidates[0].personId)
                .then(resolvePersonInfo => {
                  console.log(resolvePersonInfo.person)
                  var data = resolvePersonInfo.person
                  data.faceId = faceId.faceId
                  console.log(data)
                  personData.push(data)
                  console.log(personData)
                  callback()

                  // return res.status(resolve.status).send(resolve)
                })
                .catch(reject => {
                  console.log(reject)
                  callback()
                  // return res.status(reject.status).send(reject)
                })
            } else {
              var data = {}
              data.faceId = faceId.faceId
              console.log(data)
              personData.push(data)
              callback()
            }
          }, err => {
            if (err) {
              console.log(err)
            }
            return res.status(200).send(personData)
          })
        })
        .catch(reject => {
          console.log('detectAndIdentify')

          console.log(reject)

          return res.status(reject.status).send(reject)
        })
    }).catch(reject => {
      console.log(reject)
      return res.status(500).send({ message: 'Google cloud error' })
    })
  })
})

function getPersonId (mssv) {
  return new Promise((resolve, reject) => {
    userRef.child(mssv).once('value', function (data) {
      const user = data.val()
      if (user) { return resolve({ personId: user.MSPersonId }) }
      return reject({ message: 'MSSV not found' })
    })
  })
}

function trainPersonGroup (personGroupId) {
  return new Promise((resolve, reject) => {
    const url = config.microsoft.face + '/persongroups/' + personGroupId + '/train'
    var options = {
      url: url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.microsoft.key1
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
        return resolve({ fileName: fileName })
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
    var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' +
      (start ? '?start=' + start : '') +
      (top ? '?top=' + top : '')
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
        saveUserToDatabase(person.userData, resolve.person)
        console.log(person.name + ' import successfully, personId: ' + resolve.person.personId)
      })
      .catch(reject => {
        console.log(reject)
      })
  })
}

router.get('/person-groups/:personGroupId/init', (req, res) => {
  initPersonInPersonGroup(req.params.personGroupId)
  return res.status(200)
})

function saveImageToDatabase (imgObj) {
  imageRef.child(imgObj.name).set({
    location: imgObj.location,
    time: Date.now(),
    userId: imgObj.userId
  })
}

function saveUserToDatabase (userId, person) {
  userRef.child(userId).set({
    MSPersonId: person.personId,
    name: person.name
  })
}
module.exports = router
