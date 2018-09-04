const config = require('../config')

const index = {
  image: config.address + '/favicon.ico',
  description: 'We have created a fictional band website. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  title: 'God\'s Eye',
  type: 'website',
  url: config.address
}
const face = {
  known: 'known-faces',
  unknown: 'unidentified-faces',
  IDENTIFYTHRESHOLD: parseFloat(0.5),
  ADDPERSONTHRESHOLD: parseFloat(0.85)

}
// const relationshipEnum = {
//   STRANGER: 0,
//   FRIEND: 1
// }

const score = {
  DECREASERATE: -4,
  STRANGERRATE: 1.5,
  FRIENDRATE: 0.75,
  FAMILYRATE: 0.5,
  STRANGERBASESCORE: 10,
  FRIENDBASESCORE: 10,
  FAMILYBASESCORE: 10
}
const relationshipEnum = {
  STRANGER: 0,
  FRIEND: 1,
  FAMILY: 2
}
const adminInfo = {
  id: '5b86b4a8a96c6a000446705b'
}

const name = {
  unknown: 'unknown'
}
const RELATIONSHIP_TYPE_ARRAY = Object.keys(relationshipEnum).map(key => relationshipEnum[key])

module.exports = {
  index: index,
  face: face,
  name: name,
  adminInfo: adminInfo,
  relationshipEnum: relationshipEnum,
  score: score,
  RELATIONSHIP_TYPE_ARRAY: RELATIONSHIP_TYPE_ARRAY
}
