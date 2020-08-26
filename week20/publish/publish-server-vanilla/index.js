const http = require('http')
const https = require('https')
const unzip = require('unzipper')

const server = http.createServer((req, res) => {
  if (req.url.match(/^\/auth/)) {
    auth(req, res)
    return
  }

  if (!req.url.match(/^\/?/)) {
    return res.end('okay')
  }

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
      const body = JSON.parse(Buffer.concat(buf).toString())
      if (body.login !== 'webfanzc') return res.end('no permission')

      const writeStream = unzip.Extract({ path: '../server/public' })
      req.pipe(writeStream)

      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('publish success')
      })
    })
  })

  requ.on('error', err => {
    console.log(err)
  })
  requ.end()
})

function auth (req, res) {
  const url = req.url.replace('/auth?', '')
  const searchParams = new URLSearchParams(url)
  const code = searchParams.get('code')
  const state = '123abc'
  const client_id = 'Iv1.c30bfc37dff054c7'
  const client_secret = '4d723ba7c1994a2109ef71d36ac284fff805d4c2'
  const redirect_uri = encodeURIComponent('http://localhost:3000/auth?id=123')
  const openUrl = `https://github.com/login/oauth/access_token?code=${code}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`

  const requ = https.request(openUrl, response => {
    const buf = []

    response.on('data', d => {
      buf.push(d)
    })

    response.on('end', r => {
      const search = new URLSearchParams(Buffer.concat(buf).toString())
      const token = search.get('access_token')

      res.writeHead(200, {
        access_token: token,
        'content-type': 'text/html'
      })
      res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`)
    })
  })

  requ.on('error', err => {
    console.log(err)
    res.end()
  })

  requ.end()
}

const options = {
  port: 3000,
  host: 'localhost'
}

server.listen(options.port, options.host)
