module.exports = {
  Response: (status, object, message) => {
    return Object.assign({
      status: status,
      message: message || ''
    }, object)
  },
  POST_NOT_FOUND: 'Post not found',
  EMAIL_EXISTED: 'Email existed',
  EMAIL_REQUIRED: 'Email existed',
  INVALID_EMAIL: 'Invalid email',
  SIGN_UP_SUCCESSFULLY: 'Sign up successfully'
}
