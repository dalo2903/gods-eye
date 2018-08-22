const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Person = mongoose.model('Person')
const rpn = require('request-promise-native')
var config = require('../../config')
const responseStatus = require('../../configs/responseStatus')

class PersonController extends BaseController {
  constructor () {
    super(Person)
  }

  async createPerson (obj, uuid) {
    let person = {
      uuid: uuid,
      name: obj.name,
      mspersonid: '',
      status: 100,
      score: 100,
      datas: obj.datas
    }
    person = await this.create(person)
    return person
  }

  async updateMicrosoftPersonId (_id, mspersonId) {
    let person = await this.get(_id)
    person.mspersonId = mspersonId
    await person.save()
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
    try {
      const res = await rpn(options)
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when create person in person group')
    }
  }

  async addFaceForPerson (personGroupId, personId, faceURL) {
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
    try {
      const res = await rpn(options) // persistedFaceId
      return res
    } catch (error) {
      console.log(error)
      throw responseStatus.Response(500, {}, 'Error when add face for person')
    }
  }
}

module.exports = new PersonController()
