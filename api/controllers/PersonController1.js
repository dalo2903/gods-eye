const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Person = mongoose.model('Person')
var request = require('request')
var config = require('../../config')
const responseStatus = require('../../configs/responseStatus')

class PersonController extends BaseController {
  constructor () {
    super(Person)
  }

  async createPerson (obj, uuid) {
    // if (!obj.title) throw responseStatus.Response(400, {}, 'title')
    const person = {
      uuid: uuid,
      name: obj.title || 'name',
      mspersonid: '',
      status: 100,
      score: 100,
      datas: obj.datas
    }
    await this.create(person)
  }

  async getPerson (_id) {
    const person = await Person.findById(_id).populate({ path: 'author', select: 'name avatar uuid' })
      .populate({ path: 'datas', select: 'URL' }).exec()
    if (!person) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { person: person })
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
        userData: ''
      },
      json: true
    }
    request(options, (err, res) => {
      if (err) {
        console.log(err)
        throw err
      }
      if (res.statusCode === 200) {
        const personId = res.body.personId
        console.log(personId)
        return { status: res.statusCode, personId: personId }
      } else {
        throw responseStatus.Response(res.statusCode, { status: res.statusCode, error: res.body.error }, res.body.error)
      }
    })
  }

  // async addFaceForPerson (personGroupId, personId, faceURL) {
  //   var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces'
  //   var options = {
  //     url: url,
  //     method: 'POST',
  //     headers: {
  //       'Ocp-Apim-Subscription-Key': config.microsoft.key1
  //     },
  //     body: {
  //       url: faceURL
  //     },
  //     json: true
  //   }
  //   request(options, (err, res) => {
  //     if (err) {
  //       console.log(err)
  //       throw responseStatus.Response(500, {error: err})
  //     }
  //     console.log(res.b)
  //     if (res.statusCode === 200) {
  //       var message = 'Add face (url: ' + faceURL + ') for Person with id' + personId + ' successfully. PersistedFaceId:: ' + res.body.persistedFaceId
  //       return { status: res.statusCode, message: message }
  //     } else {
  //       throw responseStatus.Response(res.statusCode, { status: res.statusCode, error: res.body.error }, res.body.error)
  //     }
  //   })
  // }

  // async getPostPopulateAuthor (_id) {
  //   const person = await Post.findById(_id).populate({ path: 'author', select: 'name avatar uuid' }).exec()
  //   if (!person) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
  //   else return responseStatus.Response(200, { person: person })
  // }

  // async getPostsPopulateAuthor () {
  //   const posts = await Post.find().populate({ path: 'author', select: 'name avatar uuid' }).populate({ path: 'datas', select: 'URL' }).sort('-createdAt').exec()
  //   return responseStatus.Response(200, { posts: posts })
  // }
}

// function createPersonInPersonGroup (personGroupId, person) {
//   return new Promise((resolve, reject) => {
//     var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/'
//     var options = {
//       url: url,
//       method: 'POST',
//       headers: {
//         'Ocp-Apim-Subscription-Key': config.microsoft.key1
//       },
//       body: {
//         name: person.name,
//         userData: person.userData
//       },
//       json: true
//     }
//     request(options, (err, res) => {
//       if (err) {
//         console.log(err)
//         return reject({ status: 500, error: err })
//       }
//       if (res.statusCode === 200) {
//         person.personId = res.body.personId
//         return resolve({ status: res.statusCode, person: person })
//       } else {
//         return reject({ status: res.statusCode, error: res.body.error })
//       }
//     })
//   })
// }

// function addFaceForPerson (personGroupId, personId, faceURL) {
//   return new Promise((resolve, reject) => {
//     var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces'
//     var options = {
//       url: url,
//       method: 'POST',
//       headers: {
//         'Ocp-Apim-Subscription-Key': config.microsoft.key1
//       },
//       body: {
//         url: faceURL
//       },
//       json: true
//     }
//     request(options, (err, res) => {
//       if (err) {
//         console.log(err)
//         return reject({ status: 500, error: err })
//       }
//       if (res.statusCode === 200) {
//         var message = 'Add face (url: ' + faceURL + ') for Person with id' + personId + ' successfully. PersistedFaceId:: ' + res.body.persistedFaceId
//         return resolve({ status: res.statusCode, message: message })
//       } else {
//         return reject({ status: res.statusCode, error: res.body.error })
//       }
//     })
//   })
// }

module.exports = new PersonController()
