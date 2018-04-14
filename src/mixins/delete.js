import interact from 'interactjs'
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
    triggerDelete () {
      this.$refs.annotations.childNodes.forEach(elm => {
        const shape = SVG.adopt(elm)
        if (shape.data('selected')) {
          interact(elm).unset()
          shape.selectize(false, { deepSelect: ['g', 'foreignObject', 'polygon'].includes(shape.type) })
          this.$nextTick(() => shape.remove())
        }
      })
      this.$emit('update:delete', false)
    }
  }
}
