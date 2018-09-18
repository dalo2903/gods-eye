const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema({ // CRUD owner
  name: {
    type: String,
    default: ''
  },
  type: {
    type: Number,
    default: 0
  },
  location: {
    owner: {
      type: String,
      default: ''
    },
    others: {
      type: String,
      default: ''
    }
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('Role', RoleSchema)
