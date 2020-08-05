var tty = require('tty')
var ttys = require('ttys')
var readline = require('readline')

var stdout = ttys.stdout
var stdin = ttys.stdin


stdin.setRawMode(true)

stdin.resume()
stdin.setEncoding('utf8')

async function getChar() {
  return new Promise(resolve => {
    stdin.once('data', key => {
      resolve(key)
    })
  })
}
function up (n = 1) {
  stdout.write('\033['+n+'A')
}
function down (n=1) {
  stdout.write('\033['+n+'B')
}
function right (n=1) {
  stdout.write('\033['+n+'C')
}
function left (n=1) {
  stdout.write('\033['+n+'D')
}
void async function (){
  stdout.write('你想选哪个?\n')
  let res = await select(['选项一','选项二','选项三'])
  stdout.write(res+'\n')
  process.exit()
}()
async function select (choices) {
  let selected = 0
  for (const [index,choice] of choices.entries()) {
    if(index === selected){
      stdout.write("[\x1b[32mx\x1b[0m]" +choice+'\n')
    }else{
      stdout.write("[ ]" +choice+'\n')
    }
  }
  up(choices.length)
  right()
  while(true){
    let char = await getChar() 

    if(char === '\u0003'){
       down(choices.length-selected)
       stdout.write('\n')
       process.exit()
       return
    }

    if(char==='w'&&selected>0){
        stdout.write(" ")
        left()
        selected --
        up()
        stdout.write("\x1b[32mx\x1b[0m")
        left()
    }
    if(char==='s'&&selected<choices.length-1){
        stdout.write(" ")
        left()
        selected++
        down()
        stdout.write("\x1b[32mx\x1b[0m")
        left()
    } 
    if(char === '\r') {
      down(choices.length-selected)
      return choices[selected]
    }
    // if(codes[2]&&codes[2] === 68) right()
    // if(codes[2]&&codes[2] === 67) left()
  }
}
