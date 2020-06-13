function getStyle (element) {
  if (!element.style) {
    element.style = {}
  }
  // 遍历样式
  for (const prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value
    // 这里我们只解析px或数字作为单位的样式
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }
  return element.style
}

function layout (element) {
  if (!element.computedStyle) return
  // 只解析flex的元素
  const elementStyle = getStyle(element)
  if (elementStyle.display !== 'flex') return
  // 获取所有元素节点
  const items = element.children.filter(e => e.type === 'element')
  // 元素排序
  items.sort((a, b) => (a.order || 0) - (b.order || 0))

  const style = elementStyle
  // 这里只是为了给一些默认属性 如果在HTML写的比较全也可以忽略这一段
  ;['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row'
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch'
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch'
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap'
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }
  // 解析的核心 对应的分别是
  /** 
   * mainSize 主属性 为row排列width column排列时为height
   * mainStart 主轴的坐标起始方向 row时为left reverse时相反 为right column同理
   * mainEnd 主轴结束方向 与mainStart为反向
   * mainSign 起始就是一个向量符号 
   * mainBase 起点坐标
   * cross同理
   */
  let mainSize,mainStart,mainEnd,mainSign,mainBase,
    crossSize,crossStart,crossEnd,crossSign,crossBase
  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }
  if (style.flexWrap === 'wrap-reverse') { 
    [crossStart, crossEnd] = [crossEnd, crossStart]
    crossSign = -1
  }else {
    crossBase = 0
    crossSign = +1
  }

  let isAutoMainSize = false 
  if (!style[mainSize]) { // 父元素没设置主轴尺寸 那么自动大小
    elementStyle[mainSize] = 0

    for (const i = 0,len = items.length;i < len;i++) {
      const item = items[i]
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== undefined) {
        elementStyle[mainSize] += itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  let flexLine = [] // 当前行
  let flexLines = [flexLine] // 所有行 先将第一行存入
  let mainSpace = elementStyle[mainSize] // 剩余空间
  let crossSpace = 0 // 每一行在交叉轴所占空间

  for (let i = 0,len = items.length;i < len;i++) {
    const item = items[i]
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null) { // 如果没指定在主轴上的尺寸 那么置为0
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) { // 如果子元素指定了flex属性 直接加入当前行 因为设置了flex以为这个元素可以伸缩
      flexLine.push(item)
    }else if (style.flexWrap === 'nowrap' && isAutoMainSize) { // 如果父元素的flexwrap为nowrap 即不换行 并且isAutoMainSize为true 那么父元素的剩余空间要减去子元素的宽度
      mainSpace -= itemStyle[mainSize]

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        // 按照最大的高度计算父元素高度
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    }else { // 如果父元素不是nowrap 那么当子元素在主轴的大小不能超过父元素
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      // 如果剩余主轴空间不足 那么应该换行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        // 此时本行结束 直接重置 开始下一行
        flexLine = []
        flexLines.push(flexLine)
        flexLine.push(item)
        // 主轴和交叉轴的空间也应重置
        mainSpace = style[mainSize]
        crossSpace = 0
      }else {
        flexLine.push(item)
      }

      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        // 按当前行在交叉轴所占空间最大的计算当前行在交叉轴的空间
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      mainSpace -= itemStyle[mainSize]
    }
  }
  // 设置当前行剩余空间
  flexLine.mainSpace = mainSpace
  // 如果flexwrap为不换行或者主轴空间自动大小 那么交叉轴的空间等于样式中设定的大小
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
  }else {
    // 否则当前行在交叉轴的空间等于当前行中元素的最大高度
    flexLine.crossSpace = crossSpace
  }
  // 若剩余空间为负数 所有flex元素为0 等比压缩剩余元素
  if (mainSpace < 0) {
    let scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    for (let i = 0;i < items.length; i++) {
      const item = items[i]
      const itemStyle = getStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }
      // 计算元素在主轴的起始位置和结束位置
      itemStyle[mainSize] = itemStyle[mainSize] * scale
      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  }else {
    flexLines.forEach(items => {
      let mainSpace = items.mainSpace
      let flexTotal = 0 // 计算flex总值
      for (let i = 0;i < items.length; i++) {
        let item = items[i]
        let itemStyle = getStyle(item)

        if ((item.flex !== null) && (itemStyle.flex !== undefined)) {
          flexTotal += itemStyle.flex
          continue
        }
      }
      // 如果有flex的元素 按元素的flex比例分配剩余空间
      if (flexTotal > 0) {
        let currentMain = mainBase
        for (let i = 0;i < items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }
      // 计算元素在主轴的起始位置和结束位置

          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      }else {
        let currentMain,step // step表示元素间距
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          step = 0
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          step = 0
        }
        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase
          step = 0
        }
        if (style.justifyContent === 'space-between') {
          step = mainSpace / (item.length - 1) * mainSign + mainBase
          currentMain = step / 2 + mainBase
        }
        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign
          currentMain = step / 2 + mainBase
        }
        for (let i = 0;i < items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }
  // 计算交叉轴的尺寸 crossSpace
  // align-items align-self
  if (!style[crossSize]) { // 没写尺寸自动撑开
    crossSpace = 0
    elementStyle[crossSize] = 0
    for (let i = 0;i < flexLines.length;i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
    }
  }else { // 有尺寸则设为元素的尺寸
    crossSpace = style[crossSize]
    for (let i = 0;i < flexLines.length; i++) {
      crossSpace -= flexLines.crossSpace
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  }else {
    crossBase = 0
  }
  let lineSize = style[crossSize] / flexLines.length
  let step
  if (style.alignContent === 'flex-start') {
    crossBase += 0
    step = 0
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
    step = 0
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2
    step = 0
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0
    step = crossSpace / (flexLines.length - 1)
  }
  if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length
    crossBase += crossSign * step / 2
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0
    step = 0
  }
  flexLines.forEach(items => {
    // stretch时撑开交叉轴
    let lineCrossSize = style.alignContent === 'stretch' ?
      items.crossSpace + crossSpace / flexLines.length :
      items.crossSpace

    for (let i = 0;i < items.length;i++) {
      let item = items[i]
      let itemStyle = getStyle(item)
      let align = itemStyle.alignSelf || style.alignItems

      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = (align === 'stretch') ?
          lineCrossSize :
          0
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) ? itemStyle[crossSize] : lineCrossSize)
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }
    crossBase += crossSign * (lineCrossSize + step)
  })
}
module.exports = layout
