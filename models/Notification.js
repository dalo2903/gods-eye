const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  seen: {
    type: Boolean,
    default: false
  },
  URL: {
    type: String,
    default: ''
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('Notification', NotificationSchema)
