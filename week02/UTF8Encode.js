/**
 * @description 对字符串进行UTF8编码
 * @author 张聪
 * @date 2020-04-20
 * @param {String} str
 * @returns {Array} 编码的字节对应数组
 */
function str2utf8 (str) {
  if(!str||typeof str !== 'string') return []
  // 首先encodeURIComponent api对71个字符未做utf8编码处理 我们要自行对其进行编码
  const unencodeReg = /[!'()*\-._~0-9A-Za-z]/
  const ret = []

  Array.prototype.forEach.call(str, (item) => {
    // 如果是encodeURIComponent不能编码的字符 我们手动进行转换 其他的直接使用encodeURIComponent api进行编码
    if (unencodeReg.test(item)) {
      ret.push(item.charCodeAt().toString(16))
    }else {
      ret.push(...encodeURIComponent(item).slice(1).split('%')) // 这里slice是为了去掉编码后第一个% 防止split出现一个空的项
    }
  })

  return ret
}

/**
 * @description 对应的解码方法
 * @author 张聪
 * @date 2020-04-20
 * @param {Array} buffer 编码后的buffer数组
 * @returns {String} 解码后的字符串
 */
function utf82str (buffer) {
  if(!buffer||!Array.isArray(buffer)) return ''

  // 这里可以直接接触decodeURIComponent进行解析
  return decodeURIComponent(buffer.map(item => '%'+item.toString(16)).join(''))
}

// 这里是和node的buffer做了下编码后的对比 测试编码/解码是否正确
const buffer = new Buffer('一')
console.log(buffer,str2utf8('一'),utf82str(str2utf8('一'))) // <Buffer e4 b8 80> [ 'E4', 'B8', '80' ] 一