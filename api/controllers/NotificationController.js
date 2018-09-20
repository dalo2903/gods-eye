const BaseController = require('./BaseController')
const mongoose = require('mongoose')
const Notification = mongoose.model('Notification')
const responseStatus = require('../../configs/responseStatus')

class NotificationController extends BaseController {
  constructor () {
    super(Notification)
  }

  async createNotification (obj) {
    const notification = {
      to: obj.to,
      title: obj.title,
      type: obj.type,
      URL: obj.URL,
      identifyResult: obj.identifyResult,
      location: obj.location
    }
    // console.log(notification)
    await this.create(notification)
  }
  async getNotification (_id) {
    const notification = await Notification.findById(_id).populate({
      path: 'identifyResult.personId',
      model: 'Person',
      select: 'name'
    }).populate({
      path: 'location',
      select: 'address'
    }).exec()
    // if (!notification) throw responseStatus.Response(404, {}, responseStatus.POST_NOT_FOUND)
    // else
    return responseStatus.Response(200, { notification: notification })
  }
  async updateNotificationSeen (_id) {
    let notification = await this.get(_id)
    notification.seen = true
    await notification.save()
  }
  async getUnseenUserNotifications (userId, skip, limit) {
    const notifications = await Notification.find({ to: userId, seen: false }).sort('-createdAt').skip(skip).limit(limit)
    return responseStatus.Response(200, { notifications: notifications })
  }
  async getAllUserNotifications (userId, skip, limit) {
    const notifications = await Notification.find({ to: userId }).sort('-createdAt').skip(skip).limit(limit)
    return responseStatus.Response(200, { notifications: notifications })
  }
}

module.exports = new NotificationController()
