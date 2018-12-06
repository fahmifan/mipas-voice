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

function ucFirst(string) 
{
  return string
    .split(' ')
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ')
}

app.get('/api/responses', (req, res) => {
  sheet.pull().then((auth) => {
    sheet.listResponse(auth).then((rows) => {
      // mapping rows
      const mapped = rows.map((row, idx) => {
        const date = new Date(row[0])
        return {
          "createdAt": `${date.getDate()}/${date.getMonth() + 1} ${date.getUTCFullYear()}`,
          "major": ucFirst(row[1]),
          "topic": row[2],
          "message":  row[3],
        }         
      }).reverse()

      res.status(200).json(mapped)
    })
    .catch(error => {
      console.log("Error", error)
      res.status(400).json(error)
    })
  })
  .catch(error => {
    console.log("Error", error)
    res.status(400).json(error)
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})