const list = document.getElementById('container').children
const ret = []
for (const ele of list) {
  if(ele.getAttribute('data-tag').match(/css/)){
    {
      ret.push({
        name:ele.children[1].innerText,
        url:ele.children[1].children[0].href
      })
    }
  }
}