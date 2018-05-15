var firebase = require('firebase')
var config = require('../../config')

firebase.initializeApp(config.firebase)

module.exports = firebase
