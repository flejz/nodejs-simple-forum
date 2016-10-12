const express = require('express')
const path = require('path')
const app = express()

// Static path
app.use(express.static(path.join(__dirname, 'client')))
app.get('/', (req, res) =>{
  res.render('client/index.html')
})

// Exporting module
module.exports = app
