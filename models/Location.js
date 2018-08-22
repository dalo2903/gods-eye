const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  address: {
    type: String,
    default: ''
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('Location', LocationSchema)
