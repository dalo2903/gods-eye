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
      datas: obj.datas,
      isknown: true
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
    const person = await Person.findById(_id).populate({ path: 'person', select: 'mspersonid name locationid' })
      .populate({ path: 'datas', select: 'URL' }).exec()
    if (!person) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { person: person })
  }
  async addDataForPerson (_id, dataId) {
    let person = await this.get(_id)
    person.datas.push(dataId)
  }
}

module.exports = new PersonController()
