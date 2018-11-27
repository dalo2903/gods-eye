var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')
const AuthService = require('../services/AuthService')
const passport = require('passport')
const responseStatus = require('../../configs/responseStatus')

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

// router.post('/sign-in', async (req, res) => {
//   try {
//     const response = await authController.signIn(req.body)
//     const token = AuthService.signJWTToken(req.body.email)
//     req.session.token = token
//     req.session.user = response.user
//     return res.send(response)
//   } catch (error) {
//     console.log(error)
//     return res.status(error.status || 500).send(error)
//   }
// })

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    const user = req.user
    const token = AuthService.signJWTToken(user.email)
    req.session.token = token
    req.session.user = user
    return res.redirect('/')
  })

router.post('/sign-in', async (req, res) => {
  try {
    passport.authenticate('local', function (err, user, info) {
      if (err) { throw responseStatus.Response(403, {}, responseStatus.WRONG_EMAIL_OR_PASSWORD) }
      if (!user) { throw responseStatus.Response(403, {}, responseStatus.WRONG_EMAIL_OR_PASSWORD) }
      const token = AuthService.signJWTToken(req.body.email)
      req.session.token = token
      req.session.user = user
      return res.send({ user: user })
    })(req, res)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

router.post('/sign-up', async (req, res) => {
  try {
    const response = await authController.signUp(req.body)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

// router.get('/test', (req, res) => {
//   const sessionCookie = req.cookies.session || ''
//   authController.verifySessionCookie(sessionCookie)
//     .then(resolve => {
//       return res.status(resolve.status).send(resolve)
//     }).catch(reject => {
//       return res.status(reject.status).send(reject)
//     })
// })

router.get('/test', async (req, res) => {
  try {
    const token = req.session.token
    const response = await AuthService.verifyJWTToken(token)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

// router.get('/sign-out', (req, res) => {
//   res.clearCookie('session')
//   res.clearCookie('user_id')
//   res.clearCookie('user_name')
//   return res.redirect('/')
// })

router.get('/sign-out', (req, res) => {
  delete req.session.user
  delete req.session.token
  return res.redirect('/')
})

module.exports = router
