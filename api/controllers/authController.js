// var firebase = require('./firebaseController')
var responseStatus = require('../../configs/responseStatus')
var config = require('../../config')
// var admin = require('./firebaseAdminController')
const UserController = require('../controllers/UserController')

// Get a database reference to our posts
// var db = admin.database()
// var userRef = db.ref('user')

// userRef.limitToLast(1).on('child_added', function (snapshot, prevChildKey) {
//   var newUser = snapshot.val()
// })

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
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    const expiresIn = config.cookieOptions.maxAge
    admin.auth().createSessionCookie(idToken, { expiresIn })
      .then((sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = config.cookieOptions
        verifySessionCookie(sessionCookie)
          .then(resolveVerify => {
            const userInfo = {
              userId: resolveVerify.user_id,
              name: resolveVerify.name,
              uuid: resolveVerify.user_id,
              avatar: resolveVerify.picture,
              email: resolveVerify.email
            }
            UserController.createUser(userInfo)
            return resolve(responseStatus.Response(200, {sessionCookie: sessionCookie, options: options, userInfo: userInfo}))
          })
          .catch(rejectVerify => {
            console.log(rejectVerify)
            return reject(responseStatus.Response(401, { errorMessage: 'UNAUTHORIZED REQUEST!' }))
          })
      }, err => {
        if (err) {
          console.log(err)
          return reject(responseStatus.Response(401, { errorMessage: 'UNAUTHORIZED REQUEST!' }))
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
      return resolve(responseStatus.Response(200, decodedClaims))
    }).catch(err => {
      // Session cookie is unavailable or invalid. Force user to login.
      if (err) {
        console.log(err.errorInfo.message)
        return reject(responseStatus.Response(401))
      }
    })
  })
}

async function signUp (obj) {
  await UserController.createUserV2(obj)
  return responseStatus.Response(200, {}, responseStatus.SIGN_UP_SUCCESSFULLY)
}

async function signIn (obj) {
  const response = await UserController.signIn(obj)
  return response
}

module.exports = {
  verifyIdToken: verifyIdToken,
  // testSignIn: testSignIn,
  generateSessionCookie: generateSessionCookie,
  verifySessionCookie: verifySessionCookie,
  signUp: signUp,
  signIn: signIn
}
