const mongoose = require('mongoose')
const Schema = mongoose.Schema
const constants = require('../configs/constants')

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
    enum: constants.RELATIONSHIP_TYPE_ARRAY,
    default: constants.relationshipEnum.STRANGER
  }
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

mongoose.model('Relationship', RelationshipSchema)
