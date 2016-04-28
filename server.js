'use strict'
const path = require('path')
const express = require('express')
const http = require('http')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');

const app = express()

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile('/public/index.html')
})
app.post('/uploads', upload.single('file'), function(req, res) {
  // res.writeHead(200, {"Content-Type": "application/json"})
  console.log(req.file);
  res.json({
    name: req.file.originalname,
    size: req.file.size
  })
  clearUploads()
})

app.get("*", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("404!")
})

function clearUploads(){
  var path = __dirname + '/uploads/' ;
  if( fs.existsSync(path) ) {
   fs.readdirSync(path).forEach(function(file,index){
     var curPath = path + "/" + file
     if(fs.lstatSync(curPath).isDirectory()) { // recurse
       deleteFolderRecursive(curPath)
     } else { // delete file
       fs.unlinkSync(curPath)
     }
   })
   fs.rmdirSync(path)
  }
}

const port = process.env.PORT || 8080
http.createServer(app).listen(port)
console.log("Server Running on port: " + port)
