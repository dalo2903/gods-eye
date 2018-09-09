const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  type: {
    type: Number,
    default: 0
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('Role', RoleSchema)
