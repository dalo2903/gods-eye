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
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  },
  role: {
    type: Number,
    default: 0
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    sparse: true
  },
  subscribed: [{
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }]
}, { usePushEach: true, timestamps: true })

mongoose.model('User', UserSchema)
