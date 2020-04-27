function number2String (num, hex=10) {
  let isPositive = num>0 ? '':'-' // 是不是正数
  let result = ''
  num=Math.abs(num)
  let integer = Math.floor(num)
  let fraction = String(num).match(/\.\d+$/)
  if (fraction) {
    fraction = fraction[0].replace('', '')
  }

  while (integer > 0) {
    result = String(integer % hex) + result
    integer = Math.floor(integer / hex)
  }
  return fraction ? `${isPositive}${result?result:0}${fraction}` : `${isPositive}${result}`

}