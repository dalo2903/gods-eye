// var request = require('request')
// var config = require('../../config')
// // var responseStatus = require('../../configs/responseStatus')
// var admin = require('./firebaseAdminController')

// // Get a database reference to our posts
// var db = admin.database()

// function createPersonInPersonGroup (personGroupId, person) {
//   return new Promise((resolve, reject) => {
//     var url = config.microsoft.face + '/persongroups/' + personGroupId + '/persons/'
//     var options = {
//       url: url,
//       method: 'POST',
//       headers: {
//         'Ocp-Apim-Subscription-Key': config.microsoft.key1
//       },
//       body: {
//         name: person.name,
//         userData: person.userData
//       },
//       json: true
//     }
//     request(options, (err, res) => {
//       if (err) {
//         console.log(err)
//         return reject({ status: 500, error: err })
//       }
//       if (res.statusCode === 200) {
//         person.personId = res.body.personId
//         saveUserToDatabase(person.userData, person)
//         return resolve({ status: res.statusCode, person: person })
//       } else {
//         return reject({ status: res.statusCode, error: res.body.error })
//       }
//     })
//   })
// }

// function saveUserToDatabase (userId, person) {
//   const thisUser = db.ref('user/' + userId)
//   thisUser.update({
//     'MSPersonId': person.personId
//   })
// }

// module.exports = {
//   createPersonInPersonGroup: createPersonInPersonGroup
// }
