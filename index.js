require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const { sheet } = require('./spreadsheet.js')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.get('/api/responses', (req, res) => {
  sheet.pull().then((auth) => {
    sheet.listResponse(auth).then((rows) => {
      // mapping rows
      const mapped = rows.map((row, idx) => {
        return {
          "createdAt": row[0],
          "major": row[1],
          "topic": row[2],
          "message":  row[3],
        }         
      })

      res.status(200).json(mapped)
    })
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})