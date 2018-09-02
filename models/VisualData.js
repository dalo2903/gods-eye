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
  identifyResult: {
    persons: [
      {
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
      }
    ]
  },
  isImage: {
    type: Boolean,
    default: true
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('VisualData', VisualDataSchema)
