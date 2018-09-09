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
      URL: obj.URL
    }
    await this.create(notification)
  }

  async getUserNotifications (userId, skip, limit) {
    const notifications = await Notification.find({ to: userId }).sort('-createdAt').skip(skip).limit(limit)
    return responseStatus.Response(200, { notifications: notifications })
  }
}

module.exports = new NotificationController()
