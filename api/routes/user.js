const express = require('express')
let router = express.Router()
const PostController = require('../controllers/PostController')

router.get('/:userId/posts', async (req, res) => {
  try {
    const userId = req.params.userId
    const response = await PostController.getPostsSameUserCreated(userId)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
