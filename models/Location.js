const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  address: {
    type: String,
    default: ''
  },
  userIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { usePushEach: true, timestamps: true })

mongoose.model('Location', LocationSchema)
