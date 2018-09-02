const mongoose = require('mongoose')
const Schema = mongoose.Schema
const relationshipEnum = require('../configs/constants').relationshipEnum

const RelationshipSchema = new Schema({
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  type: {
    type: String,
    enum: relationshipEnum
  }
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

mongoose.model('Relationship', RelationshipSchema)
