const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const User = mongoose.model('User')

class UserController extends BaseController {
  constructor () {
    super(User)
  }

  async getUserByUUID (uuid) {
    return User.findOne({ uuid: uuid })
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
}

module.exports = new UserController()
