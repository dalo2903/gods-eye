const authController = require('../controllers/authController')

async function isLoggedIn (session) {
  const decodedClaim = await authController.verifySessionCookie(session)
  return decodedClaim.user_id
}

function getSessionFromRequest (req) {
  return req.cookies.session
}

module.exports = {
  isLoggedIn: isLoggedIn,
  getSessionFromRequest: getSessionFromRequest
}
