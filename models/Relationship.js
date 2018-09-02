const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RelationshipSchema = new Schema({
  personId1: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  personId2: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  }
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

RelationshipSchema.virtual('author', {
  ref: 'User',
  localField: 'uuid',
  foreignField: 'uuid',
  justOne: true
})

mongoose.model('Relationship', RelationshipSchema)
