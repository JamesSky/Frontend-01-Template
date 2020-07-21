var parser = require('./parser')

module.exports = function(source){
  console.log(source)
  let tree = parser.parseHTML(source)
  let template = null
  let script = null
  for (let node of tree.children) {
    if(node.tagName === 'template'){
      template = node.children.filter(e => e.type!== 'text')[0]
    }
    if(node.tagName=='script'){
      script  = node.children[0].content
    }
  }
  let visit = (node) => {
    if(node.type === 'text'){
      return JSON.stringify(node.content)
    }

    let attrs = {}
    let children = node.children.map(node => visit(node))

    for (const attribute of node.attributes) {
      attrs[attribute.name] = attribute.value 
    }

    return `
      create("${node.tagName}",${JSON.stringify(attrs)}${children.length?',':''}${children.join(',')})
    `
  }
  let ret = `
  import { Wrapper, Text, create } from './createElement'
  
  export class Carousel {
    render() {
      let ret = ${visit(template)}
      return ret
    }
    setAttribute (name, value) {
      this[name] = value
    }
    mountTo(parent){
      this.render().mountTo(parent)
    }
  }
  `
  console.log(
    ret
  ,'=====template')
  return ret
}