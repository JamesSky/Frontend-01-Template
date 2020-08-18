const http = require('http')
const fs = require('fs')
const path = require('path')
const unzip = require('unzipper')

const server = http.createServer((req,res) => {

  // let writeStream = fs.createWriteStream(__dirname+'/../server/public/'+)
  // req.pipe(writeStream)
  let writeStream = unzip.Extract({path:'../server/public'})
  req.pipe(writeStream)

  req.on('end', () => {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('okay')
  })
 
})
const options = {
  port: 3000,
  host:'localhost'
}
server.listen(options.port, options.host)