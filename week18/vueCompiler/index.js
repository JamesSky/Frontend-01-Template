const {compileTemplate} = require ('@vue/compiler-sfc')

console.dir(
   compileTemplate({filename:'demo.vue',source:'<div>Hello world</div>'})
)
