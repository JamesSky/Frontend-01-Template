const EOF = Symbol('EOF') // End of file
const stack = [{type: 'document',children: []}]
let currentToken = null
let currentAttribute = null
let currentTextNode = null

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

      top.children.push(element)

      if (!token.isSelfClosing) {
        stack.push(element)
      }

      currentTextNode = null
      break
    case 'endTag':
      if (top.tagName !== token.tagName) {
        throw new Error(`Tag start end does'n match`)
      } else {
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
    return beforeAttributeName
  } else if (c === '>') {
    return endTagOpen
  } else if (c === EOF) {
  } else if (c === '/') {
    return selfClosingStartTag
  } else {
    return beforeAttributeName
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
    emit(currentToken)
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
  return stack
}
