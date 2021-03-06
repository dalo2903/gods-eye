const mongoose = require('mongoose')
const dataTables = require('mongoose-datatables')
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
  adminLabel: {
    type: String,
    default: 'pending'  // pending, suspicious, notSuspicios
  },
  labels: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    label: {
      type: String
    }
  }],
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

VisualDataSchema.plugin(dataTables)

mongoose.model('VisualData', VisualDataSchema)
