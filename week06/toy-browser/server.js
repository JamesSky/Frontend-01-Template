const http = require('http')
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  console.log('request received')
  res.end(`<html maaa=a >
  <head>
      <style>
  body div #myid{
      width:100px;
      background-color: #ff5000;
  }
  body div img{
      width:30px;
      background-color: #ff1111;
  }
   div #myid{
    width:40px;
    background-color: #ff5000;
} 
html body div .img1{
    width:40px;
    background-color: #ff5000;
} 
body div .img2{
    width:50px;
    background-color: #ff5000;
}
      </style>
  </head>
  <body>
      <div>
          <img id="myid"/>
          <img class="img1 img2"/>
      </div>
  </body>
  </html>`);
});

server.listen(8088)