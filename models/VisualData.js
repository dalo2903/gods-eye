const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VisualDataSchema = new Schema({
  description: {
    type: String,
    default: ''
  },
  URL: {
    type: String,
    required: true
  },
  isImage: {
    type: Boolean,
    default: true
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('VisualData', VisualDataSchema)
