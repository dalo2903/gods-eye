const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true
  },
  phone: {
    type: Number
  },
  studentId: {
    type: String
  },
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  department: {
    type: String
  },
  year: {
    type: String
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('User', UserSchema)
