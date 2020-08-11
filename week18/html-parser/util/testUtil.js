export function hasProperty (attrs, name) {
  if(!attrs.length || !Array.isArray(attrs)) return false

  return attrs.some(item => item.name === name)
}
export function getProperty(attrs, name){
  if(!attrs.length || !Array.isArray(attrs) || !hasProperty(attrs,name)) return null

  let attr = attrs.find(attr => attr.name === name)
  return attr.value
}