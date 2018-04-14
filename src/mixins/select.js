import interact from 'interactjs'
import SVG from 'svg.js'
import 'svg.select.js'

export default {
  props: {
    multipleSelect: Boolean
  },

  methods: {
    makeSelectable (node) {
      const annotator = SVG.adopt(node)

      const cleanupDot = selector => {
        const remove = classCSS => selector.remember('_selectHandler').nested.select(classCSS).members.forEach(member => member.remove())
        remove('.svg_select_boundingRect')
        if (['circle', 'ellipse'].includes(selector.type)) { // remove edges selector for 'circle' and 'ellipse'
          remove('.svg_select_points_lt')
          remove('.svg_select_points_rt')
          remove('.svg_select_points_rb')
          remove('.svg_select_points_lb')
        } else if (selector.type === 'path') selector.remember('_selectHandler').nested.remove()
      }

      const unselectOthers = () => {
        this.$refs.annotations.childNodes.forEach(elm => {
          if (!node.isSameNode(elm)) {
            const shape = SVG.adopt(elm)
            shape.selectize(false, { deepSelect: ['g', 'foreignObject', 'polygon'].includes(shape.type) })

            if (shape.data('selected')) {
              shape.data('selected', null)
              this.$emit('unselect', shape)
            }
          }
        })
      }

      const selectListener = event => {
        const selector = annotator.selectize({
          deepSelect: true,
          rotationPoint: false,
          points: true
        }).data('selected', true)
        this.$emit('select', selector)
        cleanupDot(selector)

        if (!this.multipleSelect) {   // workaround for preserve dot, delete mixin workaround
          unselectOthers()
        }
      }
      const selection = interact(node).on('tap', selectListener)

      return selection
    },

    enableSelection (enabled = true) {
      if (this.$refs.annotations.hasChildNodes()) {
        this.$refs.annotations.childNodes.forEach((node, id) => {
          if (!enabled) {
            interact(node).selection.off('tap')
            this.background.fire('click') // unselect all
            this.background.off('click')
          } else {
            this.makeSelectable(node)
            this.background.on('click', this.unselectAll)
          }
        })
      }
    },

    unselectAll () {
      if (this.$refs.annotations.hasChildNodes()) {
        this.$refs.annotations.childNodes.forEach((node, id) => {
          const annotator = SVG.adopt(node)
          if (annotator.data('selected')) {
            annotator.selectize(false, { deepSelect: ['g', 'foreignObject', 'polygon'].includes(annotator.type) })
            annotator.data('selected', null)
            this.$emit('unselect', annotator)
          }
        })
      }
    }
  }
}
