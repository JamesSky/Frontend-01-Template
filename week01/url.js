const URL = {
  /**
   * queryString 查询参数
   * @author 张聪
   * @param {String} 查询的参数名
   * 查询不到时返回undefined
   */
  queryString(name) {
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    let results = regex.exec(location.search)
    let encoded = null

    if (results) {
      encoded = results[1]
      return decodeURIComponent(encoded)
    }

    return undefined
  },
  /**
     * parseQuery 解析查询字符串
     * @author 张聪
     * @param {String} search 要解析的字符串
     * @return {Object} 解析后的对象
     */
  parseQuery(search) {
    const reg = /([^=&\s]+)[=\s]([^=&\s]+)/g
    const query = {}

    search = search.replace('?', '')
    if (!search) return query

    while(reg.exec(search)){
      query[RegExp.$1] = decodeURIComponent(RegExp.$2)
    }

    return query
  },
  /**
     * stringify 将query对象转化为字符串
     * @author 张聪
     * @param {Object} 要转化的query对象
     * @return {String} 转化后的字符串
     */
  stringify(queryObj) {
    if (!queryObj) {
      return ''
    }

    let convertString = ''
    
    Object.keys(queryObj).forEach(function (key) {
      const value = queryObj[key]

      convertString += key

      if (value) {
        convertString += '=' + encodeURIComponent(queryObj[key])
      }else {
        convertString += '='
      }
      convertString += '&'
    })

    convertString = convertString.replace(/\&$/g, '')
    return convertString
  }
}
