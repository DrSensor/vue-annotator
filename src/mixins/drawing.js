import interact from 'interactjs'
import SVG from 'svg.js'
import 'svg.draw.js'

export default {
  data () {
    return {
      drawingable: undefined
    }
  },

  methods: {
    $_haveVNodeMoreThan: (number, slots, callback) => { if (slots) if (slots.length > 1) callback() },

    enableDrawing (enabled = true) {
      if (enabled && (this.drawingable ? !interact.isSet(this.background.node) : true)) {
        this.$_haveVNodeMoreThan(1, this.$slots.drawing, () => {
          throw Error(`only 1 slot="drawing" allowed, you have ${this.$slots.drawing.length} slot="drawing"`)
        })
        this.background.style('cursor', 'crosshair')

        let annotator
        let attr = {}
        this.drawingable = interact(this.background.node).styleCursor(false)
          .draggable({
            inertia: this.inertia,
            snap: { targets: [this.gridTarget] },
            restrict: 'svg', // allow drawing only in background element (outside annotation)
            autoScroll: true,

            onstart: event => {
              annotator = SVG.adopt(this.$slots.drawing[0].elm).clone() // strange behaviour, shift() with drawing[0] will make error
              attr.oncontextmenu = annotator.attr('oncontextmenu')
              annotator.draw('point', event)
                .style('cursor', 'crosshair')
                .addClass('foreground')
                .attr('oncontextmenu', 'return false;')
                .on('contextmenu', event => {
                  annotator.draw('cancel').data('canceled', true)
                  this.$emit('draw-cancel')
                })
            },

            onmove: event => this.$emit('draw', annotator.draw('update', event)),

            onend: event => {
              if (!annotator.data('canceled')) {
                annotator.draw('stop', event).style('cursor', null).removeClass('foreground').toParent(this.annotations).off('contextmenu')
                this.$forceUpdate()
                this.$emit('draw-end', annotator)
              } else annotator.off('contextmenu').data('canceled', null)

              for (const key in attr) {
                annotator.attr(key, attr[key] || null)
              }
            }
          })
      } else {
        this.background.style('cursor', 'default')
        if (this.drawingable) this.drawingable.unset()
      }
    }
  }
}
