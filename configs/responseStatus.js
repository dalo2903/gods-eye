module.exports = {
  Response: (status, object, message) => {
    return Object.assign({
      status: status,
      message: message || ''
    }, object)
  },
  POST_NOT_FOUND: 'Post not found'
}
