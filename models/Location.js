const mongoose = require('mongoose')
const dataTables = require('mongoose-datatables')
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
  subscribers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { usePushEach: true, timestamps: true })

LocationSchema.index({location: '2dsphere'})

LocationSchema.plugin(dataTables)

mongoose.model('Location', LocationSchema)
