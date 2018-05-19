const config = require('../config')

const index = {
  image: config.address + '/favicon.ico',
  description: 'If you’re someone who is routinely misplacing or losing things like the TV remote, your keys, wallet, or smartphone, then this app is created for you. GE is an app that can identify objects, match and link existing data from open data sources (images, videos, audio files are shared publicly by users) to search for an object. This can be applied to tracing lost items, lost or missing person, and improve security in the Smart City.',
  title: 'God\'s Eye',
  type: 'website',
  url: config.address
}
module.exports = {
  index: index
}
