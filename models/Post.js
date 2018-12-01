const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  userCreated: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    default: ''
  }],
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: ''
  },
  datas: [{
    type: Schema.Types.ObjectId,
    ref: 'VisualData'
  }],
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  status: {
    type: Number,
    default: 0 // 0: Pending, 1: Approved
  },
  reported: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

// PostSchema.virtual('author', {
//   ref: 'User',
//   localField: 'uuid',
//   foreignField: 'uuid',
//   justOne: true
// })

mongoose.model('Post', PostSchema)
