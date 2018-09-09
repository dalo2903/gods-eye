const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  // uuid: {
  //   type: String
  // },
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
  password: {
    type: String
  },
  phone: {
    type: Number
  },
  // studentId: {
  //   type: String
  // },
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  // department: {
  //   type: String
  // },
  // year: {
  //   type: String
  // }
  role: {
    type: Number,
    default: 0
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('User', UserSchema)
