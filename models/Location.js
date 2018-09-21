const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  userIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { usePushEach: true, timestamps: true })

LocationSchema.index({location: '2dsphere'})

mongoose.model('Location', LocationSchema)
