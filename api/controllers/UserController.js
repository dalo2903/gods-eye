const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const User = mongoose.model('User')
// const Location = mongoose.model('Location')
// const LocationController = require('./LocationController')
const responseStatus = require('../../configs/responseStatus')
const common = require('../common')
const bcrypt = require('bcrypt')

class UserController extends BaseController {
  constructor() {
    super(User)
  }

  async getUserByUUID(uuid) {
    return User.findOne({ uuid: uuid })
  }

  async getUserByEmail(email) {
    return User.findOne({ email: email })
  }
  async getUsersByLocation(location) {
    return User.find({ address: location })
  }
  async getUser(_id) {
    var user = await this.get(_id)
    return user
  }
  async banUser(_id){
    var user= await this.get(_id)
    user.role = -1
    user.save()
  }
  async unbanUser(_id){
    var user= await this.get(_id)
    user.role = 0
    user.save()
  }
  async addSubcribedLocation(_id, locationId) {
    var user = await this.get(_id)
    if (!user.subscribed) {
      user.subscribed = []
    }
    let index = user.subscribed.indexOf(locationId)
    if (index <= -1) {
      user.subscribed.push(locationId)
      user.save()
    }
    return responseStatus.Response(200, {}, responseStatus.SUBSCRIBE_SUCCESSFULLY)
  }
  async removeSubcribedLocation(_id, locationId) {
    let user = await this.get(_id)
    if (!user.subscribed) {
      user.subscribed = []
    }
    let index = user.subscribed.indexOf(locationId)
    if (index > -1) {
      user.subscribed.splice(index, 1)
      user.save()
    }
    return responseStatus.Response(200, {}, responseStatus.UNSUBSCRIBE_SUCCESSFULLY)
  }
  async getSubcribedLocation(_id) {
    const user = await User.findById(_id).populate('subscribed')
    return user
  }
  async createUser(obj) {
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
  async getAllUsers () {
    const users = await this.getAll()
    return responseStatus.Response(200, { users: users })
  }
  async createUserV2(obj) {
    if (!obj.name) throw responseStatus.Response(400, {}, responseStatus.NAME_REQUIRED)
    if (!obj.email) throw responseStatus.Response(400, {}, responseStatus.EMAIL_REQUIRED)
    if (!common.validateEmail(obj.email)) throw responseStatus.Response(400, {}, responseStatus.INVALID_EMAIL)
    if (!obj.password) throw responseStatus.Response(400, {}, responseStatus.PASSWORD_REQUIRED)
    let user = await this.getUserByEmail(obj.email)
    if (!user) {
      // let location = await Location.findOne().near('location', {
      //   center: obj.place.location,
      //   maxDistance: 10
      // })
      // let location = await LocationController.existNearbyLocation(obj.place.location, 10)
      /* }){ location: {
        $nearSphere: {
          $geometry: {
            type: obj.place.location.type,
            coordinates: obj.place.location.coordinates
          },
          $minDistance: 10
        }
      }}) */

      // if (!location) {
      //   location = await Location.create(obj.place)
      // }

      // obj.address = location._id

      user = await this.create(obj)
      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return err
        user.password = hash
        user.save()
      })
    } else {
      throw responseStatus.Response(409, {}, responseStatus.EMAIL_EXISTED)
    }
  }

  async findOrCreateSocialUser(obj) {
    let user = await this.getUserByEmail(obj.email)
    if (!user) {
      user = await this.create(obj)
    }
    return user
  }

  async signIn(obj) {
    if (!obj.email) throw responseStatus.Response(400, {}, responseStatus.EMAIL_REQUIRED)
    if (!common.validateEmail(obj.email)) throw responseStatus.Response(400, {}, responseStatus.INVALID_EMAIL)
    if (!obj.password) throw responseStatus.Response(400, {}, responseStatus.PASSWORD_REQUIRED)
    let user = await this.getUserByEmail(obj.email)
    if (!user) {
      throw responseStatus.Response(403, {}, responseStatus.WRONG_EMAIL_OR_PASSWORD)
    }
    const resolve = await bcrypt.compare(obj.password, user.password)
    if (!resolve) throw responseStatus.Response(403, {}, responseStatus.WRONG_EMAIL_OR_PASSWORD)
    user = JSON.parse(JSON.stringify(user))
    delete user.password
    return responseStatus.Response(200, { user: user }, responseStatus.SIGN_IN_SUCCESSFULLY)
  }
}

module.exports = new UserController()
