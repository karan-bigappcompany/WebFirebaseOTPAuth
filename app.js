require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()

const morgan = require('morgan')
app.use(morgan('dev'))

const bodyParser = require('body-parser')
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.listen(3000, () => {
  console.log('App Started on port: 3000')
})
