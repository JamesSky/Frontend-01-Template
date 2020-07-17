var parser = require('./parser')

module.exports = function(source){
  console.log(source)
  console.log(JSON.stringify(parser.parseHTML(source),null, '  '))
  console.log(this.resourcePath, 'is my loader')
  return ''
}