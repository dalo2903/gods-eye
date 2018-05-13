var config = require('../../config')
var firebase = require('firebase')
var provider = new firebase.auth.GoogleAuthProvider()

firebase.initializeApp(config.firebase)

function testSignIn (idToken) {
  var credential = firebase.auth.GoogleAuthProvider.credential(idToken)
  firebase.auth().signInAndRetrieveDataWithCredential(credential).then(result => {
    console.log(result);
    
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code
    var errorMessage = error.message
    // The email of the user's account used.
    var email = error.email
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential
    console.log(error)
    // ...
  })
}

module.exports = {
  testSignIn: testSignIn
}
