const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonSchema = new Schema({
  uuid: {
    type: String,
    required: true
  },
  mspersonid: {
    type: String
  },
  name: {
    type: String,
    required: true,
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
  }]
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

PersonSchema.virtual('author', {
  ref: 'User',
  localField: 'uuid',
  foreignField: 'uuid',
  justOne: true
})

mongoose.model('Person', PersonSchema)
