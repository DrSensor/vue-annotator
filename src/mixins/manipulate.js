import interact from 'interactjs'
import SVG from 'svg.js'
import 'svg.select.js'
import 'svg.draw.js'

export default {
  props: {
    inertia: Boolean,
    grid: {
      type: [Array, Number],
      validator: (value) => (value.length === 2 && value.every(v => typeof v === 'number')) || (typeof (value) === 'number')
    },
    minSize: {
      type: [Array, Number],
      default: () => 10,
      validator: (value) => (value.length === 2 && value.every(v => typeof v === 'number')) || (typeof (value) === 'number')
    },
    multipleSelect: Boolean
  },

  data () {
    return {
      interactables: []     // waste of memory?
    }
  },

  methods: {
    /** @func fixDrawingMode is hard fix, need to think another solution */
    makeInteractable (node, fixDrawingMode = false) {
      const master = SVG.adopt(this.$refs.svg)

      const interaction = interact(node)
        .draggable({
          inertia: this.inertia,
          snap: { targets: [this.gridTarget] },

          // keep the element within the area of it's parent
          restrict: {
            restriction: 'svg',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          autoScroll: true,

          // call this function on every dragmove event
          onmove: event => SVG.adopt(event.target).dmove(event.dx, event.dy)
        })

        .resizable({
          inertia: this.inertia,
          snap: { targets: [this.gridTarget] },
          // // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          // // keep the edges inside the parent
          restrictEdges: fixDrawingMode ? undefined : {
            outer: 'svg',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          autoScroll: true,

          // // minimum size
          restrictSize: fixDrawingMode ? undefined : {
            min: { width: this.minWidth, height: this.minHeight }
          },

          // call this function on every resizemove event
          onmove: (event) => {
            const target = SVG.adopt(event.target)

            let x = target.x() + event.deltaRect.left
            let y = target.y() + event.deltaRect.top
            switch (target.type) {
              case 'ellipse':
                target.move(x + event.deltaRect.width / 2, y + event.deltaRect.height / 2)
                target.size(event.rect.width, event.rect.height)
                break
              case 'circle':
                const antiPhytagoras = (x, y) => x != 0 && y != 0 && Math.sign(x) != Math.sign(y) ? 0 : Math.sign(x + y) * Math.hypot(event.deltaRect.width, event.deltaRect.height)
                const delta = antiPhytagoras(event.deltaRect.width, event.deltaRect.height)
                const d = s => delta != 0 ? (s / 2) : 0
                const threshold = (this.minWidth + this.minHeight) / 2 // because deltaRect will keep going when resizing in diagonal

                // BUG: still have slight move when resizing diagonally
                if (event.rect.width > threshold && event.rect.height > threshold) {
                  x += d(event.deltaRect.width)
                  y += d(event.deltaRect.height)
                } else {
                  x = target.x()
                  y = target.y()
                }

                let diameter = target.attr('r') * 2 + delta
                diameter = Math.max(diameter, threshold)

                // Enable resizing when circle in edge of canvas
                const notEdgeTopLeft = x + Math.abs(event.deltaRect.width) >= 0 && y + Math.abs(event.deltaRect.height) >= 0
                const notEdgeBottomRight = (x + diameter) <= master.width() + Math.abs(event.deltaRect.width) && (y + diameter) <= master.height() + Math.abs(event.deltaRect.height)

                if (notEdgeBottomRight && notEdgeTopLeft) {
                  target.move(x, y)
                  target.size(diameter)
                }
                break
              default:
                target.move(x, y)
                target.size(event.rect.width, event.rect.height)
                break
            }
          }
        })

      return interaction
    },

    enableInteraction (enabled = true) {
      if (this.$refs.annotations.hasChildNodes()) {
        this.$refs.annotations.childNodes.forEach((node, id) => {
          if (!enabled && this.interactables.length) {
            this.interactables.forEach(interaction => interaction.draggable(false).resizable(false))
          } else this.interactables[id] = this.makeInteractable(node)
        })
      }
    }
  },

  beforeUpdate () {
    if ((this.$refs.annotations.hasChildNodes() ? this.$refs.annotations.childNodes.length : 0) > this.interactables.length) {
      const element = this.$refs.annotations.childNodes[this.$refs.annotations.childNodes.length - 1]
      const interaction = this.makeInteractable(element, true)
      this.interactables.push(interaction)
    }
  },

  computed: {
    gridTarget: function () {
      return this.grid ? interact.createSnapGrid({
        x: this.grid[0],
        y: this.grid[1]
      }) : null
    },
    minWidth: function () {
      return typeof (this.minSize) === 'number' ? this.minSize : this.minSize[0]
    },
    minHeight: function () {
      return typeof (this.minSize) === 'number' ? this.minSize : this.minSize[1]
    }
  }
}
