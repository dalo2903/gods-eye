const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonSchema = new Schema({
  uuid: {
    type: String,
    required: true
  },
  mspersonId: {
    type: String
  },
  name: {
    type: String,
    required: false,
    default: ''
  },
  status: {
    type: Number
  },
  score: {
    type: Number
  },
  datas: [{
    type: Schema.Types.ObjectId,
    ref: 'VisualData'
  }],
  isknown: {
    type: Boolean,
    required: true,
    default: true
  }
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

PersonSchema.virtual('author', {
  ref: 'User',
  localField: 'uuid',
  foreignField: 'uuid',
  justOne: true
})

mongoose.model('Person', PersonSchema)
