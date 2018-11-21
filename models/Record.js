const mongoose = require('mongoose')
const dataTables = require('mongoose-datatables')
const Schema = mongoose.Schema

const RecordSchema = new Schema({
  data: {
    type: Schema.Types.ObjectId,
    ref: 'VisualData'
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  }
}, { usePushEach: true, timestamps: true, toJSON: { virtuals: true } })

// RecordSchema.virtual('author', {
//   ref: 'User',
//   localField: 'uuid',
//   foreignField: 'uuid',
//   justOne: true
// })

RecordSchema.plugin(dataTables)

mongoose.model('Record', RecordSchema)
