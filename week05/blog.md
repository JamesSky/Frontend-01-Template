## 浏览器的工作原理(一) 用状态机简单解析 http 请求

最近自己也是在学习浏览器相关的一些知识 之后会持续的输出自己的学习成果给大家 希望能给大家带来一些帮助  
首先就是从 http 请求开始说起 我们本文就是带大家通过一个简单的字符状态机的方式来解析 http 的响应 在这之前我们要先对 http 的请求有一个简单的了解
给大家附上一个 http 标准的文档 大家如果不太了解 http 请求的基本内容可以去查看一下[IETF2616](https://tools.ietf.org/html/rfc2616)

### 请求报文首部的结构如下

- 请求行
  - 请求方法
  - PATH
  - HTTP 版本
  ```
      GET /path HTTP/1.1
  ```
- 请求首部字段
- 通用首部字段
- 实体首部字段
- 其他

### 响应报文首部

- 状态行
  - HTTP 版本
  - 状态码
  - 原因短语
  ```
      HTTP/1.1 200 OK
  ```
- 响应首部字段
- 通用首部字段
- 实体首部字段
- 其他

在了解了这些之后 我们就可以对 http 的响应做一下解析了 首先我将会为大家提供一段我用来测试的服务代码 大家也可以自行起一个服务 这个不是我们核心要讲到的东西

```js
const http = require("http");
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  console.log("request received");
  res.end("ok");
});

server.listen(8088);
```

这个代码就是简单的为我们解析请求提供了一个可访问的环境 这里我们直接用 node 的 http 模块创建即可 接下来我们来实现核心的请求部分 首先我们实现一个 Request 方法 这里我们不直接使用 node 的 http 模块 我们用更底层的 net 模块来手动实现一个 http 请求

```js
const net = require("net");

class Request {
  constructor(options) {
    // 一些默认设置
    const defaultOptions = {
      method: "GET",
      body: {},
      host: "localhost",
      path: "/",
      port: 80,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    // 将传入的设置与默认设置合并 嫌麻烦的同学也可以直接使用函数参数默认值的方式
    options = {
      defaultOptions,
      ...options,
    };
    // 将设置映射到类中
    Object.keys(defaultOptions).forEach((key) => {
      this[key] = options[key];
    });
    // 这里我们只实现两种content-type的解析 其实分别对应了get和post的默认值 post请求我们直接把body进行一个JSON格式化即可
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    }
    // get请求我们要将键值对使用=号拼接 然后把拼接后的值用&连接
    if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body)
        .map((key) => {
          return `${key}=${encodeURIComponent(this.body[key])}`;
        })
        .join("&");
      this.headers["Content-Length"] = this.bodyText.length;
    }
  }
  // 这里是提供了一个按照http请求的格式格式化之后的请求
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map((key) => `${key}: ${this.headers[key]}`)
  .join("\r\n")}\r
\r
${this.bodyText}`;
  }
  // 发送请求的方法
  send(connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            console.log("connected to server!");
            connection.write(this.toString());
          }
        );
        connection.on("data", (data) => {
          console.log("data", data.toString());
          connection.end();
        });
        connection.on("error", (err) => {
          console.log("error", err);
          connection.end();
        });
        connection.on("end", () => {
          console.log("disconnected from server");
        });
      }
    });
  }
}

void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8088,
    body: {
      a: "1",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    path: "/",
  });

  await request.send();
})();
```

这段代码写好之后 我们直接执行一下看看响应的返回值

```http
HTTP/1.1 200 OK
Content-Type: text/plain
X-Foo: bar
Date: Mon, 18 May 2020 03:45:46 GMT
Connection: keep-alive
Transfer-Encoding: chunked

2
ok
0

```

这就是一个标准的 http 响应的格式 也是我们今天核心的解析请求部分要解析的地方
首先是一个响应头 包含了 http 版本 状态码 和对应的信息 然后是一下我们自定义的头部和 http 的默认字段

最下方是我们上一步创建的服务中返回的 body 好多人可能会疑惑 2 和 0 是什么意思 这里的 2 和 0 其实是标注的 body 的长度 遇到 0 时代表下边没有其他的东西了 我们可以认为这意味着响应结束了
下面我们来演示如何用简单的状态机对这个 http 请求做一个语法和词法的解析(其实是一个简单的伪实现 我们只是为了了解如何解析 http 请求 而不是真正的做一个解析 http 的库 真正的实现要考虑更多的边界状况和异常处理 比如中文对应的编码长度和英文不一致的问题)

```js
class ResponseParser {
  constructor() {
    // 这里我们声明了七个状态 对应的是我们http响应中的各个部分
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;
    this.current = this.WAITING_STATUS_LINE; // 我们默认的状态
    // 对一些内容作了初始化
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.statusLine = "";
    this.bodyParser = null;
  }
  // 这个就是我们用来判断请求是否结束的标志
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  // 获取格式化后的response内容
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }
  // 我们对外接收内容的方法
  receive(string) {
    for (let c of string) {
      this.receiveChar(c);
    }
  }
  // 我们的核心状态机
  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        // 遇到\r(CR) 这意味着状态行结束了 我们进入等待状态行结束的状态
        this.current = this.WAITING_STATUS_LINE_END;
      } else if (char === "\n") {
        // 遇到\n(LF)即代表状态行已经结束 直接进入下一个状态 解析Header
        this.current = this.WAITING_HEADER_NAME;
      } else {
        // 其他字符我们直接拼接到状态行
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === "\n") {
        // 跟上边的思路一样 遇到\n我们直接进入下一状态
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        // 遇到: 意味着header的Name字段结束了 我们要进入下一个状态 等待headerName后边紧跟着的空格
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        // 遇到\r了 头部内容即将结束 我们进入等待头部结束的状态
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers["Transfer-Encoding"] === "chunked") {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        // 同样 其他字符我们直接追加到headerName
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      // 这个也很好理解 即\r\n同时出现 我们进入了等待body的阶段
      if (char === "\n") {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      // 如果有空格 表示有值 我们进入了等待header值的状态
      if (char === " ") {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        // 在当前状态遇到\r 我们进入下一状态 等待当前header行结束 在这期间要把当前header写入我们的headers中 因为这代表着我们的一个header完全解析完毕了 注意解析完一定要清空headerName 和headerValue的值
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = this.headerValue = "";
      } else {
        // 其他字符我们直接拼接到headerValue中
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === "\n") {
        // 遇到\n我们就知道这一行确实结束了 进入下一状态继续等待下一个header
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_BODY) {
      // body的解析我们交给下一个parser来做
      this.bodyParser.receiveChar(char);
    }
  }
}
// 这个是我们用来解析body的parser
class TrunkedBodyParser {
  constructor() {
    // 同样有很多的状态 对应着接收length 接收内容 和接收新行的状态
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }
  // 核心方法
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === "\r") {
        // 遇到\r表示我们当前的length行即将结束 进入下一状态 等待length行结束 如果在此状态中我们接收到的length为0 表示这个响应结束了
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        // content length是16进制的 我们要手动的解析一下进制
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") {
        // 在这个状态如果遇到了\n 我们就可以开始解析内容了
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      if (/[^\r\n]/.test(char)) {
        // 如果不是\r\n我们就push进content中 不然content中会有很多\r\n的字符 这不是我们想要的
        this.content.push(char);
      }
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE; // 如果解析完毕 进入下一状态 等待下一行
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === "\r") {
        // 如果遇到\r 我们进入等待行结束的状态
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === "\n") {
        // 遇到\n我们重新回到等待contentLength的阶段 执行下一个循环
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}
```

至此我们的解析函数都写好了 下面我们来印证一下是否正确 首先要对我们的 Requset send 方法做一下改造

```js
 send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          console.log('connected to server!')
          connection.write(this.toString())
        })
        connection.on('data', (data) => {

          parser.receive(data.toString())
          console.log(parser.response,parser.isFinished)
          connection.end()
        })
        connection.on('error', (err) => {
          console.log('error', err)
          connection.end()
        })
        connection.on('end', () => {
          console.log('disconnected from server')
        })
      }
    })
  }
```
然后我们再次执行一下看一下我们的parser能否正确的解析
```JS
{
  statusCode: '200',
  statusText: 'OK',
  headers: {
    'Content-Type': 'text/plain',
    'X-Foo': 'bar',
    Date: 'Mon, 18 May 2020 04:52:08 GMT',
    Connection: 'keep-alive',
    'Transfer-Encoding': 'chunked'
  },
  body: 'ok'
}
```
OK 这样我们就正确的解析出了我们的response 

下一次我将带大家学习如何用一个有限状态机对我们请求回来的html做词法和语法分析 从而构建一个DOM树