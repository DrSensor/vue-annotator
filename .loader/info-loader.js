const marked = require('marked')

module.exports = function (source, map) {
  let src = marked(source)
  src = JSON.stringify(src)
  return `module.exports = function(Component) {Component.options.__info = ${src}}`
}