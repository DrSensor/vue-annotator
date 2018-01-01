// COPY THIS TO `Vue.methods` IF YOU WANT TO USE IT

$_cloneComponentData (vnode) {
  const data = Object.assign({}, vnode.data, { hooks: undefined })
  data.props = vnode.componentOptions.propsData
  data.on = Object.assign(data.on || {}, vnode.componentOptions.listeners)
},

$_cloneVNode (vnode) {
  const children = vnode.children
    ? vnode.children.map(x => cloneVNode(x))
    : []
  const isComponent = !!vnode.componentOptions
  const tag = isComponent
    ? vnode.componentOptions.Ctor
    : vnode.tag
  const data = isComponent
    ? this.cloneComponentData(vnode)
    : Object.assign({}, vnode.data)
  const clone = this.$createElement(tag, data, children) // doesn't produce clone.elm

  /** WARNING: this solution produce 2 <rect> because of cloneNode()
   * For more information @see https://github.com/vuejs/vue/issues/7347#issuecomment-354641887
  */
  clone.elm = vnode.elm.parentNode.insertBefore(vnode.elm.cloneNode(), vnode.elm)

  return clone
},

$_pushVNode2Slot (slotName, vnode) {
  if (!this.$slots[slotName]) this.$slots[slotName] = []
  this.$slots[slotName].push(vnode)
  this.$forceUpdate()
},
