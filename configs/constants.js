const config = require('../config')

const index = {
  image: config.address + '/favicon.ico',
  description: 'If you’re someone who is routinely misplacing or losing things like the TV remote, your keys, wallet, or smartphone, then this app is created for you. GE is an app that can identify objects, match and link existing data from open data sources (images, videos, audio files are shared publicly by users) to search for an object. This can be applied to tracing lost items, lost or missing person, and improve security in the Smart City.',
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

const RESOURCES = {
  LOCATION: 'location',
  POST: 'post'
}

const ACTIONS = {
  CREATE: 0,
  READ: 1,
  UPDATE: 2,
  DELETE: 3
}

module.exports = {
  index: index,
  face: face,
  name: name,
  adminInfo: adminInfo,
  relationshipEnum: relationshipEnum,
  score: score,
  RELATIONSHIP_TYPE_ARRAY: RELATIONSHIP_TYPE_ARRAY,
  RESOURCES: RESOURCES,
  ACTIONS: ACTIONS
}
