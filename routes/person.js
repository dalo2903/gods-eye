var express = require('express')
var router = express.Router()
var personController = require('../controllers/personController')

router.post('/', (req, res) => {
  const person = {
    name: req.body.name,
    userData: req.body.userData
  }
  personController.createPersonInPersonGroup('test-faces', person)
    .then(resolve => {
      // saveUserToDatabase(person.userData, resolve.person)
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

module.exports = router