// var firebase = require('./firebaseController')
var responseStatus = require('../../configs/responseStatus')
var admin = require('./firebaseAdminController')

// function testSignIn (_idToken) {
//   const idToken = _idToken.toString()
//   var credential = firebase.auth.GoogleAuthProvider.credential(idToken)
//   firebase.auth().signInAndRetrieveDataWithCredential(credential).then(result => {
//     console.log(result)
//     // verifyIdToken(idToken)
//   }).catch(function (error) {
//     console.log(error)
//     // Handle Errors here.
//     var errorCode = error.code
//     var errorMessage = error.message
//     // The email of the user's account used.
//     var email = error.email
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential
//     // console.log(error)
//     // ...
//   })
// }

function verifyIdToken (idToken) {
  admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
      var uid = decodedToken.uid
      console.log(uid)
      // ...
    }).catch(function (error) {
      // Handle error
      console.log(error)
    })
}

function generateSessionCookie (idToken) {
  return new Promise((resolve, reject) => {
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.

    admin.auth().createSessionCookie(idToken, { expiresIn })
      .then((sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = { maxAge: expiresIn, httpOnly: true } // Bo secure: true vi khong co HTTPS
        return resolve(responseStatus.Code200({sessionCookie: sessionCookie, options: options}))
      }, err => {
        if (err) {
          console.log(err)
          return reject(responseStatus.Code401({ errorMessage: 'UNAUTHORIZED REQUEST!' }))
        }
      })
  })
}

function verifySessionCookie (sessionCookie) {
  return new Promise((resolve, reject) => {
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    admin.auth().verifySessionCookie(
      sessionCookie, true /** checkRevoked */).then((decodedClaims) => {
      return resolve(responseStatus.Code200(decodedClaims))
    }).catch(err => {
      // Session cookie is unavailable or invalid. Force user to login.
      if (err) {
        console.log(err)
        return reject(responseStatus.Code401())
      }
    })
  })
}

module.exports = {
  verifyIdToken: verifyIdToken,
  // testSignIn: testSignIn,
  generateSessionCookie: generateSessionCookie,
  verifySessionCookie: verifySessionCookie
}
