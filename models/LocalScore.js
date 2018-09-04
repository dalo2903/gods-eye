const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocalScoreSchema = new Schema({
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  score: {
    type: Number
  },
  rate: {
    type: Number
  },
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  }
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

mongoose.model('LocalScore', LocalScoreSchema)
