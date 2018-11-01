const express = require('express')
let router = express.Router()
const RecordController = require('../controllers/RecordController')

router.get('/', async (req, res) => {
  try {
    return RecordController.getUsingDatatable(req, res)
  } catch (error) {
    console.log(error)
    return res.status(error.status || 500).send(error)
  }
})

module.exports = router
