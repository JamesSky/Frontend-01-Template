const http = require('http')
const https = require('https')
const unzip = require('unzipper')
const { resolve } = require('path')
function toPromise (func) {
  return new Promise((resolve, reject) => {
    func(resolve, reject)
  })
}
const server = http.createServer((req, res) => {
  if (req.url.match(/^\/auth/)) {
    auth(req, res)
    return
  }

  if (!req.url.match(/^\/?/)) {
    return res.end('okay')
  }
  const request = toPromise((resolve, reject) => {
    const openUrl = new URL('https://api.github.com/user')
    const token = req.headers.token
    const options = {
      hostname: openUrl.hostname,
      port: 443,
      path: openUrl.pathname,
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'Toy-Publish-server'
      },
      method: 'GET'
    }
    const requ = https.request(options, response => {
      const buf = []

      response.on('data', d => {
        buf.push(d)
      })

      response.on('end', r => {
        resolve(buf)
      })
    })

    requ.on('error', err => {
      reject(err)
    })
    requ.end()
  })
  request
    .then(buf => {
      const body = JSON.parse(Buffer.concat(buf).toString())
      if (body.login !== 'webfanzc') return res.end('no permission')

      const writeStream = unzip.Extract({ path: '../server/public' })
      req.pipe(writeStream)

      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('publish success')
      })
    })
    .catch(err => res.end(err))
})

function auth (req, res) {
  const url = req.url.replace('/auth?', '')
  const searchParams = new URLSearchParams(url)

  const request = toPromise((resolve, reject) => {
    const code = searchParams.get('code')
    const state = '123abc'
    const clientId = 'Iv1.c30bfc37dff054c7'
    const clientSecret = '4d723ba7c1994a2109ef71d36ac284fff805d4c2'
    const redirectUri = encodeURIComponent('http://localhost:3000/auth?id=123')
    const openUrl = `https://github.com/login/oauth/access_token?code=${code}&client_secret=${clientSecret}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`

    const requ = https.request(openUrl, response => {
      const buf = []

      response.on('data', d => {
        buf.push(d)
      })

      response.on('end', r => {
        resolve(buf)
      })
    })

    requ.on('error', err => {
      reject(err)
    })

    requ.end()
  })
  request
    .then(buf => {
      const search = new URLSearchParams(Buffer.concat(buf).toString())
      const token = search.get('access_token')

      res.writeHead(200, {
        access_token: token,
        'content-type': 'text/html'
      })
      res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`)
    })
    .catch(err => {
      res.end(err)
    })
}

const options = {
  port: 3000,
  host: 'localhost'
}

server.listen(options.port, options.host)
