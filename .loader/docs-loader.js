module.exports = function (source, map) {
  let src = JSON.stringify(source)
  return `module.exports = function(Component) {Component.options.__docs = ${src}}`
}