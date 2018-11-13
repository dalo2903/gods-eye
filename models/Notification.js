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
  reason: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  records: [{
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }],
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
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
