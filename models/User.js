const mongoose = require('mongoose')
const Schema = mongoose.Schema
const constants = require('../configs/constants')

const UserSchema = new Schema({
  // uuid: {
  //   type: String
  // },
  avatar: {
    type: String,
    default: constants.AVATAR_DEFAULT
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
    default: 0 // 999: admin , 0: normal user, -1: banned
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    sparse: true
  },
  subscribed: [{
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }],
  provider: {
    type: String,
    default: constants.PROVIDERS.LOCAL
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { usePushEach: true, timestamps: true })

mongoose.model('User', UserSchema)
