const http = require('http')
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  console.log('request received')
  res.end(`<html maaa=a >
  <head>
      <style>
      #container{
          width:800px;
          display:flex;
      }
        #container #myid {
            width: 200px;
          height:300px;
          background-color: rgb(255,0,0);
        }
        #container .c1 {
            flex:1;
          height:300px;
          background-color: rgb(255,255,0);
        }
        #container .c2 {
          width:400px
          height:300px;
          background-color: rgb(255,0,255);
        }
        #container .c3 {
          width:300px;
          height:300px;
          background-color: rgb(0,0,255);
        }
      </style>
  </head>
  <body>
      <div id="container">
          <div id="myid"></div>
          <div class="c1"></div>
          <div class="c2"></div>
          <div class="c3"></div>
      </div>
  </body>
  </html>`);
});

server.listen(8088)