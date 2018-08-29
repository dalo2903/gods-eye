const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const responseStatus = require('../../configs/responseStatus')
const common = require('../common')

class UserController extends BaseController {
  constructor () {
    super(User)
  }

  async getUserByUUID (uuid) {
    return User.findOne({ uuid: uuid })
  }

  async getUserByEmail (email) {
    return User.findOne({ email: email })
  }

  async createUser (obj) {
    const uuid = obj.uuid || ''
    let user = await this.getUserByUUID(uuid)
    if (!user) {
      user = await this.create(obj)
    } else {
      user.avatar = obj.avatar || user.avatar
      user.name = obj.name || user.name
      user = await user.save()
    }
  }

  async createUserV2 (obj) {
    if (!obj.email) throw responseStatus.Response(400, {}, responseStatus.EMAIL_REQUIRED)
    if (!common.validateEmail(obj.email)) throw responseStatus.Response(400, {}, responseStatus.INVALID_EMAIL)
    if (!obj.name) throw responseStatus.Response(400, {}, responseStatus.EMAIL_REQUIRED)
    let user = await this.getUserByEmail(obj.email)
    if (!user) {
      user = await this.create(obj)
    } else {
      throw responseStatus.Response(409, {}, responseStatus.EMAIL_EXISTED)
    }
  }
}

module.exports = new UserController()
