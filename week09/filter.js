const jsonText = JSON.stringify({
  'first_name': 'Jane',
  'last_name': 'Smith',
  'email': 'jane.smith@wyng.com',
  'gender': null,
  'invitations': [
    {
      'from': '',
      'code': null
    },
    {
      'from': '66',
      'code': '',
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': ''
        }
      ],
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': ''
        }
      ],
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': '',
          'first_name': 'Jane',
          'last_name': 'Smith',
          'email': 'jane.smith@wyng.com',
          'gender': null,
          'invitations': [
            {
              'from': '',
              'code': null
            },
            {
              'from': '66',
              'code': '',
              'first_name': 'Jane',
              'last_name': 'Smith',
              'email': 'jane.smith@wyng.com',
              'gender': null,
              'invitations': [
                {
                  'from': '',
                  'code': null
                },
                {
                  'from': '66',
                  'code': '',
                  'first_name': 'Jane',
                  'last_name': 'Smith',
                  'email': 'jane.smith@wyng.com',
                  'gender': null,
                  'invitations': [
                    {
                      'from': '',
                      'code': null
                    },
                    {
                      'from': '66',
                      'code': '',
                      'first_name': 'Jane',
                      'last_name': 'Smith',
                      'email': 'jane.smith@wyng.com',
                      'gender': null,
                      'invitations': [
                        {
                          'from': '',
                          'code': null
                        },
                        {
                          'from': '66',
                          'code': '',
                          'first_name': 'Jane',
                          'last_name': 'Smith',
                          'email': 'jane.smith@wyng.com',
                          'gender': null,
                          'invitations': [
                            {
                              'from': '',
                              'code': null
                            },
                            {
                              'from': '66',
                              'code': ''
                            }
                          ],
                        }
                      ],
                    }
                  ],
                }
              ],
            }
          ],
        }
      ],
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': ''
        }
      ]
    }
  ],
  'company': {
    'name': '',
    'industries': []
  },
  'address': {
    'city': 'New York',
    'state': 'NY',
    'zip': '10011',
    'street': '     '
  }
})
console.time('normal')
let currentKey = ''
let currentValue = ''
const stack = []
const keyStack = []
let jsonData = ''

function parseKeyValue() {
  const top = stack[stack.length - 1]
  if (currentValue && !/^(null|"\s*"|\[\]|\{\})$/.test(currentValue)) {
    if (top.type === 'Object') {
      top.props.push(`"${currentKey}":${currentValue}`)
    } else if (top.type === 'Array') {
      top.items.push(currentValue)
    }
  }
  currentValue = ''
  if (top.type === 'Object') {      
    currentKey = ''
  }
}

function parseArray() {
  currentValue = `[${stack.pop().items.join(',')}]`
  const top = stack[stack.length - 1]
  if (!top) {
    jsonData = currentValue
  } else if (top.type === 'Object') {
    currentKey = currentKey || keyStack.pop()
    parseKeyValue()
  } else if (top.type === 'Array') {
    parseKeyValue()
  }
}

function parseObject() {
  currentValue = `{${stack.pop().props.join(',')}}`
  const top = stack[stack.length - 1]
  if (!top) {
    jsonData = currentValue
  } else if (top.type === 'Object') {
    currentKey = currentKey || keyStack.pop()
    parseKeyValue()
  } else if (top.type === 'Array') {
    parseKeyValue()
  }
}

function dataState(char) {
  if (char === '{') {
    return startObjectState(char)
  } else if (char === '[') {
    return startArrayState(char)
  } else {
    return dataState
  }
}

function startObjectState(char) {
  if (char === '{') {
    stack.push({ type: 'Object', props: [] })
    return beforeKeyState
  } else {
    return dataState
  }
}

function startArrayState(char) {
  if (char === '[') {
    stack.push({ type: 'Array', items: [] })
    return beforeValueState
  } else {
    return dataState
  }
}

function beforeKeyState(char) {
  if (char === '}') {
    return endObjectState(char)
  } else if (char === '"') {
    return keyState
  } else {
    return beforeKeyState
  }
}

function keyState(char) {
  if (char === '"') {
    return afterKeyState
  } else {
    currentKey += char
    return keyState
  }
}

function afterKeyState(char) {
  if (char === ':') {
    return beforeValueState
  } else {
    return afterKeyState
  }
}

function beforeValueState(char) {
  if (char !== ' ') {
    return valueState(char)
  } else {
    return beforeValueState
  }
}

function valueState(char) {
  if (char === '{') {
    if (currentKey) {
      keyStack.push(currentKey)
      currentKey = ''
    }
    return startObjectState(char)
  } else if (char === '[') {
    return startArrayState(char)
  } else if (/^[,}\]]$/.test(char)) {
    return afterValueState(char)
  } else {
    currentValue += char
    return valueState
  }
}

function afterValueState(char) {
  if (char === ',') {
    parseKeyValue()
    const top = stack[stack.length - 1]
    return top.type === 'Object' ? beforeKeyState : beforeValueState
  } else if (char === '}') {
    parseKeyValue()
    return endObjectState(char)
  } else if (char === ']') {
    parseKeyValue()
    return endArrayState(char)
  } else {
    return afterValueState
  }
}

function endObjectState(char) {
  if (char === '}') {
    parseObject()
  }
  return afterValueState
}

function endArrayState(char) {
  if (char === ']') {
    parseArray()
  } 
  return afterValueState
}

let state = dataState
for (const char of jsonText) {
  state = state(char)
}

console.log(jsonData)
console.timeEnd('normal')