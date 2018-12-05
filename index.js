require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { sheet } = require('./spreadsheet.js')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  sheet.pull().then((auth) => {
    sheet.listResponse(auth).then((rows) => {
      res.status(200).json({"data": rows})
    })
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})