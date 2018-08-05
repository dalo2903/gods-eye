var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.post('/', (req, res) => {
  try {
    const idToken = req.body.idToken.toString() || ''
    authController.generateSessionCookie(idToken)
      .then(resolve => {
        const sessionCookie = resolve.sessionCookie
        const options = resolve.options
        const userInfo = resolve.userInfo
        return res.cookie('user_id', userInfo.userId, options).cookie('user_name', userInfo.name, options).cookie('session', sessionCookie, options).status(resolve.status).send()
      })
      .catch(reject => {
        return res.status(reject.status).send(reject)
      })
  } catch (error) {
    return res.status(error.status || 500).send(error)
  }
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

router.get('/sign-out', (req, res) => {
  res.clearCookie('session')
  res.clearCookie('user_id')
  res.clearCookie('user_name')
  return res.redirect('/')
})

module.exports = router
