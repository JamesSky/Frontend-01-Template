const http = require('http')
const querystring = require('querystring')
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
let filename = path.resolve(__dirname + '/package.zip')
let packname = __dirname + '/package'

const options = {
  host: 'localhost',
  port: 3000,
  path: '/?filename=package.zip',
  method: 'POST',
  headers: {
    'Content-type': 'application/octet-stream'
  }
}

var archive = archiver('zip', {
  zlib: {level: 9}
})

archive.directory(packname, false)
archive.pipe(fs.createWriteStream(__dirname + '/package.zip'))
archive.finalize()

const req = http.request(options)

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`)
})

archive.pipe(req)
archive.on('end', () => {
  req.end()
})
