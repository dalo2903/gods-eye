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
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  identifyResult: {
    personId: {
      type: Schema.Types.ObjectId,
      ref: 'Person'
    },
    confidence: {
      type: Number,
      default: 0
    },
    facerectangle: {
      top: {
        type: Number,
        default: 0
      },
      left: {
        type: Number,
        default: 0
      },
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      }
    }
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
