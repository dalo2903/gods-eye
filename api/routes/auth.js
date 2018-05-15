var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.post('/', (req, res) => {
  // authController.verifyIdToken(req.body.idToken).then().catch()
  const idToken = req.body.idToken.toString() || ''
  authController.generateSessionCookie(idToken)
    .then(resolve => {
      const sessionCookie = resolve.sessionCookie
      const options = resolve.options
      return res.cookie('session', sessionCookie, options).status(resolve.status).send()
    })
    .catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

router.get('/test', (req, res) => {
  const sessionCookie = req.cookies.session || ''
  authController.verifySessionCookie(sessionCookie)
    .then(resolve => {
      return res.status(resolve.status).send(resolve)
    }).catch(reject => {
      return res.status(reject.status).send(reject)
    })
})

router.get('/signOut', (req, res) => {
  res.clearCookie('session')
  return res.redirect('/sign-in')
})

module.exports = router
