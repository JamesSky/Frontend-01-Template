function string2Number (str) {
  const numberRegex = /^(\.\d+|(0|[1-9]\d*)(\.\d*)?)([eE][-\+]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/

  if (!str) {
    return NaN
  }
  if (typeof str !== 'string') {
    throw new Error('str 只能为字符串')
  }
  if (!numberRegex.test(str)) {
    throw new Error('数字不合法')
  }


  const isDecimal = /^(\.\d+|(0|[1-9]\d*)(\.\d*)?)([eE][-\+]?\d+)?$/.test(str)
  const isBinary = /^0[bB][01]+$/.test(str)
  const isOctal = /^0[oO][0-7]+$/.test(str)
  const isHex = /^0[xX][0-9a-fA-F]+$/.test(str)
  const isExponent = /^(\.\d+|(0|[1-9]\d*)(\.\d*)?)([eE][-\+]?\d+)$/.test(str)
  let hex

  if (isBinary) hex = 2
  if (isOctal) hex = 8
  if (isDecimal) hex = 10
  if (isHex) hex = 16
  if (isBinary || isOctal || isHex) {
    str = str.slice(2)
  }

  if (!isHex) { // 不是16进制则统一处理
    if (!isExponent) {
      let chars = str.split('')
      let number = 0
      let i = 0
      while (i < chars.length && chars[i] !== '.') {
        number = number * hex
        number += chars[i].codePointAt(0) - '0'.codePointAt(0)
        i++
      }
      if (chars[i] === '.') {
        i++
      }
      let fraction = 1
      while (i < chars.length) {
        fraction /= hex
        number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction
        i++
      }
      return number
    } else {
      let logNumber = Number(str.match(/\d+$/)[0])
      let number = str.match(/^[\d\.]+/)[0].replace(/\./, '')
      if (/^(\.\d+|(0|[1-9]\d*)(\.\d*)?)([eE][+]?\d+)?$/.test(str)) {
        return Number(number.padEnd(logNumber + 1, 0))
      } else {
        return Number(number.padStart(logNumber + number.length, 0).replace(/^0/, '0.'))
      }
    }
  } else {
    str = str.toUpperCase()
    let chars = str.split('')
    let number = 0
    let i = 0
    let wordReg = /[abcdef]/i
    const offset = 7 // A和9的码点偏移量 超过9的要减去这个偏移量

    while (i < chars.length) {
      number = number * hex

      if (wordReg.test(chars[i])) {
        number += chars[i].codePointAt(0) - '0'.codePointAt(0) - offset
      }else {
        number += chars[i].codePointAt(0) - '0'.codePointAt(0) 
      }
      i++
    }
    return number
  }
}

console.log(string2Number('0X01f'))
