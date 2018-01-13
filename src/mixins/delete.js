import SVG from 'svg.js'
import 'svg.select.js'

export default {
  props: {
    delete: [Boolean]
  },

  watch: {
    delete: function (value) {
      if (value) this.triggerDelete()
    }
  },

  methods: {
    $_gracefulUnset (elm) {
      const unset = (interacts, callback) => interacts.forEach((interack, index) => {
        if (interack.target.isSameNode(elm)) {
          callback(interack)
          delete interacts[index]
          interacts.splice(index, 1)
        }
      })

      unset(this.interactables, inter => inter.unset())
      unset(this.selectables, inter => this.background.off('click', inter.unselectListener))
    },

    triggerDelete () {
      this.$refs.annotations.childNodes.forEach(elm => {
        const shape = SVG.adopt(elm)
        if (shape.data('selected')) {
          this.$_gracefulUnset(elm)
          shape.selectize(false, { deepSelect: ['g', 'foreignObject', 'polygon'].includes(shape.type) })
          setTimeout(() => shape.remove(), 100)   // Dirty hack for multiple select delete
        }
      })
      this.$emit('update:delete', false)
    }
  }
}
