'use strict'

const express = require('express')
const http = require('http')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')

const app = express()

app.use(express.static(`${__dirname}/public`))

function clearUploads() {
  const path = `${__dirname}/uploads/`
  if (fs.existsSync(path))
    fs.readdirSync(path).forEach(file => {
      const curPath = `/${path}/${file}`
      fs.unlinkSync(curPath)
    })
}

app.get('/', (req, res) => {
  res.sendFile('/public/index.html')
})
app.post('/uploads', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({
      name: req.file.originalname,
      size: req.file.size,
    })
    clearUploads()
  } else {
    res.json({ error: 'No file to upload, please browse for a file first.' })
  }
})

app.get('*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('404!')
})

const port = process.env.PORT || 8080
http.createServer(app).listen(port)
console.log('Server Running on port: ' + port)
