<template>
  <svg ref="svg" :width="w" :height="h">

    <foreignObject ref="bgSvg" x="0" y="0" :width="w" :height="h">
      <div ref="bg" class="background">
        <slot></slot>
      </div>
    </foreignObject>

    <g ref="annotation" class="foreground">
      <slot name="annotation"></slot>
    </g>

    <slot name="drawing"></slot>

  </svg>
</template>

<script>
import interact from 'interactjs'
import SVG from 'svg.js'
import 'svg.select.js'
import 'svg.draw.js'

// import { cloneVNode } from './utils'
// import { printSlotElement } from './debug'

export default {
  name: 'Annotator',
  props: {
    width: Number,
    height: Number,
    inertia: Boolean,
    grid: {
      type: [Array, Number],
      validator: (value) => (value.length == 2 && value.every(v => typeof v === 'number')) || (typeof (value) === 'number')
    },
    minSize: {
      type: [Array, Number],
      default: () => 10,
      validator: (value) => (value.length == 2 && value.every(v => typeof v === 'number')) || (typeof (value) === 'number')
    },
    multipleSelect: Boolean,
    drawing: Boolean
  },

  watch: {
    drawing: function (value) {
      this.enableDrawing(value)
      // this.unselectAll()
    }
  },

  data () {
    return {
      w: this.width,
      h: this.height,
      interactables: [],
      drawingable: undefined,
      background: SVG.adopt(this.$refs.bgSvg),
      annotation: SVG.adopt(this.$refs.annotation)
    }
  },

  computed: {
    gridTarget: function () {
      return this.grid ? interact.createSnapGrid({
        x: this.grid[0],
        y: this.grid[1],
      }) : null
    },
    minWidth: function () {
      return typeof (this.minSize) === 'number' ? [this.minSize, this.minSize] : this.minSize[0]
    },
    minHeight: function () {
      return typeof (this.minSize) === 'number' ? [this.minSize, this.minSize] : this.minSize[1]
    }
  },

  methods: {
    $_haveVNodeMoreThan: (number, slots, callback) => { if (slots) if (slots.length > 1) callback() },

    /** CURRENTLY NOT BEING USED
     * @code
    enableUnselect () {
      if (this.$refs.annotation.hasChildNodes())
        this.$refs.annotation.childNodes.forEach((elm, id) => this.background.click(event => {
          const shape = SVG.adopt(elm)
          shape.selectize(false, { deepSelect: ['g', 'foreignObject'].includes(shape.type) })
        }))
    },

    disableSelect () {
      this.interactables.off('tap', this.$_selectListener)
    },

    unselectAll () {
      if (this.$refs.annotation.hasChildNodes())
        this.$refs.annotation.childNodes.forEach((elm, id) => {
          const shape = SVG.adopt(elm)
          shape.selectize(false, { deepSelect: ['g', 'foreignObject'].includes(shape.type) })
        })
    },

    selectAll () {
      let selector = []

      if (this.$refs.annotation.hasChildNodes()) this.$refs.annotation.childNodes.forEach((el, id) => {
        selector[id] = SVG.adopt(el.elm).selectize({
          deepSelect: true,
          rotationPoint: false,
          points: true
        })
        const remove = classCSS => selector.remember('_selectHandler').nested.select(classCSS).members.forEach(member => member.remove())

        remove('.svg_select_boundingRect')
        if (['circle', 'ellipse'].includes(selector.type)) { // remove edges selector for 'circle' and 'ellipse'
          remove('.svg_select_points_lt')
          remove('.svg_select_points_rt')
          remove('.svg_select_points_rb')
          remove('.svg_select_points_lb')
        } else if (selector.type === 'path') selector.remember('_selectHandler').nested.remove()
      })

      this.$emit('select', selector)
    },
    */
    makeInteractable (node, fixDrawingMode = false) {
      const annotator = SVG.adopt(node)

      const selectListener = event => {
        const selector = annotator.selectize({
          deepSelect: true,
          rotationPoint: false,
          points: true
        }).attr('data-selected', true)
        this.$emit('select', selector)
        const remove = classCSS => selector.remember('_selectHandler').nested.select(classCSS).members.forEach(member => member.remove())

        remove('.svg_select_boundingRect')
        if (['circle', 'ellipse'].includes(selector.type)) { // remove edges selector for 'circle' and 'ellipse'
          remove('.svg_select_points_lt')
          remove('.svg_select_points_rt')
          remove('.svg_select_points_rb')
          remove('.svg_select_points_lb')
        } else if (selector.type === 'path') selector.remember('_selectHandler').nested.remove()

        if (!this.multipleSelect)
          this.$refs.annotation.childNodes.forEach(elm => {
            if (!node.isSameNode(elm)) {
              const shape = SVG.adopt(elm)
              shape.selectize(false, { deepSelect: ['g', 'foreignObject', 'polygon'].includes(shape.type) })

              if (shape.attr('data-selected')) {
                shape.attr('data-selected', null)
                this.$emit('unselect', shape)
              }
            }
          })
      }

      const unselectListener = event => {
        annotator.selectize(false, { deepSelect: ['g', 'foreignObject', 'polygon'].includes(annotator.type) })
        if (annotator.attr('data-selected')) {
          annotator.attr('data-selected', null)
          this.$emit('unselect', annotator)
        }
      }

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
            min: { width: this.minWidth, height: this.minHeight },
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

      interaction.on('tap', selectListener)
      this.background.on('click', unselectListener)

      return interaction
    },

    enableInteraction (enabled = true) {
      const master = SVG(this.$refs.svg)

      if (this.$refs.annotation.hasChildNodes()) this.$refs.annotation.childNodes.forEach((node, id) => {
        if (!enabled && this.interactables.length) {
          this.interactables.forEach(interaction => interaction.off('tap').draggable(false).resizable(false))
          this.background.off('click')
        }
        else this.interactables[id] = this.makeInteractable(node)
      })
    },

    enableDrawing (enabled = true) {
      if (enabled && (this.drawingable ? !interact.isSet(this.background.node) : true)) {
        this.$_haveVNodeMoreThan(1, this.$slots.drawing, () => {
          throw Error(`only 1 slot="drawing" allowed, you have ${this.$slots.drawing.length} slot="drawing"`)
        })
        this.background.style('cursor', 'crosshair')

        let annotator
        this.drawingable = interact(this.background.node).styleCursor(false)
          .draggable({
            inertia: this.inertia,
            snap: { targets: [this.gridTarget] },
            restrict: 'svg', // allow drawing only in background element (outside annotation)
            autoScroll: true,

            onstart: event => {

              annotator = SVG.adopt(this.$slots.drawing[0].elm).clone() // strange behaviour, shift() with drawing[0] will make error
              annotator.draw('point', event).style('cursor', 'crosshair').addClass('foreground')
            },

            onmove: event => annotator.draw('update', event),

            onend: event => {
              annotator.draw('stop', event).style('cursor', null).removeClass('foreground').toParent(this.annotation)
              this.$forceUpdate()
            }
          })
      }
      else {
        this.background.style('cursor', 'default')
        if (this.drawingable) this.drawingable.unset()
      }
    }
  },

  updated () {
    this.w = this.width || this.$refs.bg.scrollWidth
    this.h = this.width || this.$refs.bg.scrollHeight

    if ((this.$refs.annotation.hasChildNodes() ? this.$refs.annotation.childNodes.length : 0) > this.interactables.length && this.drawing) {
      // const fixDrawMode = (this.$refs.annotation.childNodes.length == 1) // BUG: only make all previous draw disappear at second draw
      const element = this.$refs.annotation.childNodes[this.$refs.annotation.childNodes.length - 1]
      const interaction = this.makeInteractable(element, this.drawing)
      this.interactables.push(interaction)

      /** @see https://github.com/vuejs/vue/issues/7347#issuecomment-354641887
      @func this.$slots.annotation.push(toVNode(element)) 
      */
    }
  },

  mounted () {
    if (this.$slots.default) {
      const media = this.$slots.default.filter(el => ['img', 'video', 'audio', 'picture'].includes(el.tag))
      const interval = setInterval(() => {
        let loadComplete = media.every(el => el.elm.complete)
        this.$forceUpdate()
        if (loadComplete) clearInterval(interval)
      }, 43.48)
    } else this.$forceUpdate()

    this.background = SVG.adopt(this.$refs.bgSvg)
    this.annotation = SVG.adopt(this.$refs.annotation)

    this.enableInteraction()
    this.enableDrawing(this.drawing)
  }
}
</script>

<style>
.svg_select_points {
  stroke-width: 1;
  fill: black;
  stroke-dasharray: 10 10;
  stroke: black;
  stroke-opacity: 0.8;
  pointer-events: none; /* This ons is needed if you want to deselect or drag the shape*/
}

.svg_select_boundingRect {
  display: none;
}
</style>


<style scoped>
.foreground {
  /* cursor: pointer */
  fill: transparent;
}

.background {
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
