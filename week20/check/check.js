const page = require('webpage').create()

page.open('http://localhost:8080/', (status) => {
  console.log(`Status: ${status}`)
  if (status === 'success') {
    const title = page.evaluate(() => {
      const toString = function toString (pad, element) {
        const children = element.childNodes
        let childrenString = ''
        if (children && children.length) {
          for (let i = 0; i < children.length; i += 1) {
            childrenString += toString(`    ${pad}`, children[i])
          }
        }
        let name
        if (element.nodeType === Node.TEXT_NODE) {
          name = `#text ${JSON.stringify(element.textContent)}`
        }
        if (element.nodeType === Node.ELEMENT_NODE) {
          name = element.tagName
        }
        return `${pad + name}\n${childrenString}`
      }
      return toString('', document.body)
    })
    console.log(title)
  }
  phantom.exit()
})
