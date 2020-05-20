const EOF = Symbol('EOF') // End of file
const css = require('css')
const stack = [{type: 'document',children: []}]
let currentToken = null
let currentAttribute = null
let currentTextNode = null
let rules = []

function addCSSRules (text) {
  const ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

function match (element, selector) {
  if (!element.attributes || !selector) {
    return false
  }
  // 对复合选择器进行正则拆分 记录命中次数 命中次数与选择器长度相等才视为匹配
  const regPattern = /(#[a-zA-Z]+[_a-zA-Z0-9-]*?)|(\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|([a-z]+)/g
  const matched = selector.match(regPattern)
  let matchTime = 0

  for (const p of matched) {
    if (p.charAt(0) === '#') {
      const attr = element.attributes.filter(attr => attr.name === 'id')[0]
  
      if (attr && attr.value === p.replace('#', '')) {
        matchTime++
      }
    }else if (p.charAt(0) === '.') {
      const attr = element.attributes.filter(attr => attr.name === 'class')[0]

      if (attr) {
        const classes = attr.value.split(' ')

        for (let className of classes) {
          if (className === p.replace(".", '')) {
            matchTime++
          }
        }
      }
    } else {
      if (element.tagName === p) {
        matchTime++
      }
    }
  }
  
  return matchTime === matched.length
}
function specificity (selector) {
  const p = [0, 0, 0, 0]
  // 这里用正则对id和class还有标签名进行了匹配  class 规则为可以以-开头 后边跟下划线任意字母之后是任意的_-字母数字
  // id 为数字字母开头 不考虑输入中文状况(id中允许中文的一些字符) 
  // 标签名小写字母
  const regPattern = /(#[a-zA-Z]+[_a-zA-Z0-9-]*?)|(\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)|([a-z]+)/g
  const selectorParts = selector.split(' ').map(item=>item.match(regPattern))
  //
  for (const parts of selectorParts) {
    for (const part of parts) {
      if (part.charAt(0) === '#') {
        p[1] += 1
      }else if (part.charAt(0) === '.') {
        p[2] += 1
      }else {
        p[3] += 1
      }
    }
  }
  return p
}
function compare (sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}
function computeCSS (element) {
  const elements = stack.slice().reverse()
  if (!element.computedStyle) {
    element.computedStyle = { }
  }

  for (const rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse()
    // 如果匹配不到 直接匹配下一条规则
    if (!match(element, selectorParts[0])) {
      continue
    }

    let matched = false
    let j = 1

    for (let i = 0,len = elements.length;i < len; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }
    }

    matched = j >= selectorParts.length
    // 如果匹配 要把对应rule加到element中
    if (matched) {
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle

      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = { }
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
      console.log('ele', element.computedStyle)
    }
  }
// console.log(rules)
// console.log('computed CSS', element)
}

function emit (token) {
  let top = stack[stack.length - 1]
  switch (token.type) {
    case 'startTag':
      let element = {
        type: 'element',
        children: [],
        attributes: [],
        tagName: token.tagName
      }

      for (const p in token) {
        if (p !== 'type' && p !== 'tagName') {
          element.attributes.push({
            name: p,
            value: token[p]
          })
        }
      }
      computeCSS(element)

      top.children.push(element)
      element.parent = top

      if (!token.isSelfClosing) {
        stack.push(element)
      }

      currentTextNode = null
      break
    case 'endTag':
      if (top.tagName !== token.tagName) {
        throw new Error(`Tag start end does'n match`)
      } else {
        if (top.tagName === 'style') {
          addCSSRules(top.children[0].content)
        }
        stack.pop()
      }
      currentTextNode = null
      break
    case 'text':
      if (currentTextNode === null) {
        currentTextNode = {
          type: 'Text',
          content: ''
        }
        top.children.push(currentTextNode)
      }
      currentTextNode.content += token.content
      break
  }
}

function data (c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen (c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return
  }
}

function endTagOpen (c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c === '>') {
  } else if (c === EOF) {
  } else {
    return data
  }
}

function tagName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c === '=') {
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function afterAttributeName (c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if (c === '=') {
    return beforeAttributeValue
  }
  else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {
  } else if (c === '/') {
    return selfClosingStartTag
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName (c) {
  if (c.match(/^[\n\t\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {
  } else if (c === '"' || c === "'" || c === '<') {
  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue (c) {
  if (c.match(/^[\n\t\f ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeValue(c)
  } else if (c === '"') {
    return doubleQuotedAttributeValue
  } else if (c === "'") {
    return singleQuotedAttributeValue
  } else if (c === '>') {
  } else {
    return unquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue (c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue (c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}
function afterQuotedAttributeValue (c) {
  if (c.match(/^[\n\t\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  }  else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}
function unquotedAttributeValue (c) {
  if (c.match(/^[\n\t\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '"' || c === "'" || c === '<' || c === '=' || c === '`') {
  } else if (c === '\u0000') {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c
    return unquotedAttributeValue
  }
}

function selfClosingStartTag (c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === EOF) {
    return beforeAttributeName
  } else {
  }
}

module.exports.parseHTML = function parseHTML (html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
  console.log(stack);
  return stack
}
