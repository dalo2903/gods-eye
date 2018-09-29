// const authController = require('../controllers/authController')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = mongoose.model('Role')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const responseStatus = require('../../configs/responseStatus')

// async function isLoggedIn (session) {
// const decodedClaim = await authController.verifySessionCookie(session)
// return decodedClaim.user_id
// }

async function isLoggedIn (req) {
  const token = getTokenFromRequest(req)
  const resolve = await verifyJWTToken(token)
  return resolve
}

function getSessionFromRequest (req) {
  return req.cookies.session
}

function getTokenFromRequest (req) {
  return req.session.token
}

function signJWTToken (email) {
  const token = jwt.sign({
    email: email,
    loggedInTimestamp: Date.now() }, config.token.secret, {
    expiresIn: config.token.expiresIn
  })
  return token
}

async function verifyJWTToken (token) {
  if (!token) {
    throw responseStatus.Response(403, {}, responseStatus.INVALID_REQUEST)
  }
  const decoded = await jwt.verify(token, config.token.secret)
  if (!decoded || !decoded.email) {
    throw responseStatus.Response(403, {}, responseStatus.INVALID_REQUEST)
  }
  const user = await User.findOne({ email: decoded.email })
  if (!user) {
    throw responseStatus.Response(403, {}, responseStatus.INVALID_REQUEST)
  }
  return responseStatus.Response(200, { token: decoded, user: user })
}

async function checkPermission (obj) {
  const role = await Role.findOne({ type: obj.role })
  if (role && role[obj.resource]) {
    if (obj.owner && parseInt(role[obj.resource].owner.padStart(4, '0')[obj.action]) === 1) {
      return
    }
    if (!obj.owner && parseInt(role[obj.resource].others.padStart(4, '0')[obj.action]) === 1) {
      return
    }
  }
  throw responseStatus.Response(403, {}, responseStatus.INVALID_REQUEST)
}

module.exports = {
  isLoggedIn: isLoggedIn,
  getSessionFromRequest: getSessionFromRequest,
  signJWTToken: signJWTToken,
  verifyJWTToken: verifyJWTToken,
  getTokenFromRequest: getTokenFromRequest,
  checkPermission: checkPermission
}
