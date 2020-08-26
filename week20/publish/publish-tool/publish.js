const http = require('http')
// const querystring = require('querystring')
const childProcess = require('child_process')
const fs = require('fs')
const archiver = require('archiver')
const packname = __dirname + '/package'

const scope = encodeURIComponent('read:user')
const state = '123abc'
const clientId = 'Iv1.c30bfc37dff054c7'
const redirectUri = encodeURIComponent('http://localhost:3000/auth?id=123')
const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`

childProcess.exec(`open ${url}`)

const server = http.createServer((req, res) => {
  console.log(req.url)
  if (!/^\/publish/.test(req.url)) {
    res.end('failed')
    return
  }
  let token = req.url.match(/token=([^&]+)/)
  token && (token = token[1])

  const options = {
    host: 'localhost',
    port: 3000,
    path: '/?filename=package.zip',
    method: 'POST',
    headers: {
      token: token,
      'Content-type': 'application/octet-stream'
    }
  }

  var archive = archiver('zip', {
    zlib: { level: 9 }
  })

  archive.directory(packname, false)
  archive.pipe(fs.createWriteStream(__dirname + '/package.zip'))
  archive.finalize()

  const reqa = http.request(options)

  reqa.on('error', (e) => {
    console.error(`problem with request: ${e.message}`)
  })

  archive.pipe(reqa)
  archive.on('end', () => {
    reqa.end()
    res.end('published')
    server.close()
  })
})
server.listen(8080)
