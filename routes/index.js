var express = require('express')
var async = require('async')
var router = express.Router()
var config = require('../config')
var constants = require('../configs/constants')
const Storage = require('@google-cloud/storage')
var path = require('path')
var request = require('request')
var faceController = require('../api/controllers/faceController')
var admin = require('../api/controllers/firebaseAdminController')
var authController = require('../api/controllers/authController')
var responseStatus = require('../configs/responseStatus')
var db = admin.database()
var imageRef = db.ref('image')
var userRef = db.ref('user')
const storage = new Storage({
  projectId: config.google.projectId
})

// The name for the new bucket
const bucketName = config.google.cloudStorage.bucketName
const imageApi = 'http://storage.googleapis.com/centering-dock-194606.appspot.com/images/'

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
})

router.get('/post/create', (req, res) => {
  res.render('post/create', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
})

router.get('/person/create', (req, res) => {
  res.render('person/create', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
})

router.get('/post/:id', (req, res) => {
  res.render('post/detail', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || '',
    _id: req.params.id
  })
})

router.get('/*', (req, res, next) => {
  const sessionCookie = req.cookies.session || ''
  authController.verifySessionCookie(sessionCookie)
    .then(resolve => {
      return next()
    }).catch(reject => {
      return res.redirect('/')
    })
})

router.get('/my-profile', (req, res) => {
  return res.render('my-profile', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
})

function createPersonGroup (personGroupId, group) {
  return new Promise((resolve, reject) => {
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
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        return reject({ status: 500, error: err })
      }
      if (res.statusCode === 200) {
        return resolve({ status: res.statusCode })
      } else {
        return reject({ status: res.statusCode, error: res.body.error })
      }
    })
  })
}

router.put('/person-groups/:personGroupId/', (req, res) => {
  const group = {
    name: req.body.name,
    userData: req.body.userData
  }
  createPersonGroup(req.params.personGroupId, group)
    .then(resolve => {
      console.log(resolve)
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      console.log(reject)
      return res.status(reject.status).send(reject)
    })
})

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

router.get('/upload', function (req, res, next) {
  return res.render('upload', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
})

router.get('/identify', function (req, res, next) {
  return res.render('identify', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
})

router.get('/newsfeed', function (req, res, next) {
  return res.render('newsfeed', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
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
                })
                .catch(reject => {
                  console.log(reject)
                  callback()
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

// router.get('/login', (req, res) => {
//   res.render('login', constants.index)
// })

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

function listFilesByPrefix (bucketName, prefix, delimiter) {
  return new Promise((resolve, reject) => {
    // [START storage_list_files_with_prefix]
  // Imports the Google Cloud client library
    const Storage = require('@google-cloud/storage')

    // Creates a client
    const storage = new Storage()

    const options = {
      prefix: prefix
    }

    if (delimiter) {
      options.delimiter = delimiter
    }

    // Lists files in the bucket, filtered by a prefix
    storage
      .bucket(bucketName)
      .getFiles(options)
      .then(results => {
        const files = results[0]
        var urls = []
        files.forEach(file => {
          const url = 'https://storage.cloud.google.com/centering-dock-194606.appspot.com/' + file.name
          urls.push(url)
        })
        return resolve(responseStatus.Response(200, {images: urls}))
      })
      .catch(err => {
        console.error('ERROR:', err)
        return reject(responseStatus.Response(500, err))
      })
  // [END storage_list_files_with_prefix]
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

router.get('/gallery', (req, res) => {
  return res.render('gallery', {
    image: constants.index.image,
    description: constants.index.description,
    title: constants.index.title,
    type: constants.index.type,
    url: constants.index.url,
    user_id: req.cookies.user_id || '',
    user_name: req.cookies.user_name || ''
  })
})

router.get('/images', (req, res) => {
  listFilesByPrefix(bucketName, 'images/')
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    })
    .catch(reject => {
      return res.status(reject.status).send(reject)
    })
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
