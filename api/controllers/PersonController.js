const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Person = mongoose.model('Person')
// const rpn = require('request-promise-native')
// var config = require('../../config')
const responseStatus = require('../../configs/responseStatus')
class PersonController extends BaseController {
  constructor () {
    super(Person)
  }

  async createPerson (obj, userCreated) {
    let person = {
      // author: uuid,
      userCreated: userCreated,
      name: obj.name || 'unknown',
      msPersonId: obj.msPersonId || '',
      status: 100,
      score: 100,
      datas: obj.datas,
      isKnown: obj.isKnown || true
    }
    person = await this.create(person)
    console.log(`Created person id = ${person._id}`)
    return person
  }

  async updateMicrosoftPersonId (_id, msPersonId) {
    let person = await this.get(_id)
    person.msPersonId = msPersonId
    await person.save()
  }

  async getPerson (_id) {
    const person = await Person.findById(_id).populate({ path: 'person', select: 'mspersonid name locationid' })
      .populate({ path: 'datas', select: 'URL' }).exec()
    if (!person) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    else return responseStatus.Response(200, { person: person })
  }

  async getPersonsSameAuthor (userCreated) {
    const persons = await Person.find({ userCreated: userCreated }).populate({ path: 'userCreated', select: 'name avatar' }).populate({ path: 'datas', select: 'URL' })
    return responseStatus.Response(200, { persons: persons })
  }

  async getPersonByMSPersonId (msPersonId) {
    const person = await Person.findOne({ msPersonId: msPersonId }).populate({ path: 'userCreated', select: 'name avatar' }).populate({ path: 'datas', select: 'URL' })
    return person
  }

  async addDataForPerson (_id, dataId) {
    let person = await this.get(_id)
    person.datas.push(dataId)
    person = await person.save()
    return responseStatus.Response(200, { person: person }, 'Add photo successfully')
  }
}

module.exports = new PersonController()
