const config = require('../config')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

mongoose.connect(config.uriMongo, { useNewUrlParser: true })

const modelsPath = path.resolve(__dirname, '../models')
fs.readdirSync(modelsPath).forEach(file => {
  require(modelsPath + '/' + file)
})
