module.exports = {
  Response: (status, object, message) => {
    return Object.assign({
      status: status,
      message: message || ''
    }, object)
  },
  POST_NOT_FOUND: 'Post not found',
  EMAIL_EXISTED: 'Email existed',
  PHONE_EXISTED: 'Phone number existed',
  EMAIL_REQUIRED: 'Email required',
  NAME_REQUIRED: 'Full name required',
  PASSWORD_REQUIRED: 'Password required',
  TITLE_REQUIRED: 'Title required',
  LOCATION_REQUIRED: 'Location required',
  INVALID_EMAIL: 'Invalid email',
  SIGN_UP_SUCCESSFULLY: 'Sign up successfully',
  SIGN_IN_SUCCESSFULLY: 'Sign in successfully',
  WRONG_EMAIL_OR_PASSWORD: 'Wrong email or password',
  INVALID_REQUEST: 'Invalid request',
  CREATE_LOCATION_SUCCESSFULLY: 'Create location successfully',
  SUBSCRIBE_SUCCESSFULLY: 'Subcribe successfully',
  UNSUBSCRIBE_SUCCESSFULLY: 'Unsubcribe successfully',
  BANNED_ACCOUNT: 'Your account has been banned. Please contact the Administrator'
}
