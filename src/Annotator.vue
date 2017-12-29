<template>
  <svg ref="svg" :width="w" :height="h">
    <foreignObject ref="bgSvg" x="0" y="0" :width="w" :height="h">
      <div ref="bg" class="background">
        <slot></slot>
      </div>
    </foreignObject>
    <g ref="fg" class="foreground">
      <slot name="annotation"></slot>
      <slot name="drawing"></slot>
    </g>
  </svg>
</template>

<script>
import interact from 'interactjs'
import SVG from 'svg.js'
import 'svg.select.js'
import 'svg.draw.js'

export default {
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
      this.drawingable.draggable(value)
    }
  },

  data () {
    return {
      w: this.width,
      h: this.height,
      interactables: [],
      makeInteractable: Function,
      drawingable: interact(document)
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
    $cloneVNode (vnode) {
      const clonedChildren = vnode.children && vnode.children.map(vnode => this.$cloneVNode(vnode))
      const cloned = this.$createElement(vnode.tag, vnode.data, clonedChildren)
      cloned.text = vnode.text
      cloned.isComment = vnode.isComment
      cloned.componentOptions = vnode.componentOptions
      cloned.elm = vnode.elm
      cloned.context = vnode.context
      cloned.ns = vnode.ns
      cloned.isStatic = vnode.isStatic
      cloned.key = vnode.key
      return cloned
    },

    $pushVNode2Slot (slotName, vnode) {
      if (!this.$slots[slotName]) this.$slots[slotName] = []
      this.$slots[slotName].push(vnode)
      this.$forceUpdate()
    },

    $haveVNodeMoreThan: (number, slots, callback) => { if (slots) if (slots.length > 1) callback() },

    enableInteraction (enabled = true) {
      const master = SVG(this.$refs.svg)
      const background = SVG.adopt(this.$refs.bgSvg)

      this.makeInteractable = node => {
        const annotator = SVG.adopt(node)
        console.log(node.nodeName)
        return interact(node)
          .on('tap', event => { // select
            console.log(annotator)
            const selector = annotator.selectize({
              deepSelect: true,
              rotationPoint: false,
              points: true
            })
            this.$emit('select', selector)
            const remove = classCSS => selector.remember('_selectHandler').nested.select(classCSS).members.forEach(member => member.remove())

            remove('.svg_select_boundingRect')
            if (['circle', 'ellipse'].includes(selector.type)) { // remove edges selector for 'circle' and 'ellipse'
              remove('.svg_select_points_lt')
              remove('.svg_select_points_rt')
              remove('.svg_select_points_rb')
              remove('.svg_select_points_lb')
            } else if (selector.type === 'path') selector.remember('_selectHandler').nested.remove()

            if (!this.multipleSelect) this.$slots.annotation.forEach(el => { if (!node.isSameNode(el.elm)) SVG.adopt(el.elm).selectize(false, { deepSelect: true }) })
          })

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
            restrictEdges: {
              outer: 'svg',
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            autoScroll: true,

            // // minimum size
            restrictSize: {
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

        background.click(event => { annotator.selectize(false, { deepSelect: true }) }) // unselect
      }

      if (this.$slots.annotation) this.$slots.annotation.forEach((el, id) => {
        if (!enabled && this.interactables.length) {
          this.interactables.forEach(interaction => interaction.off('tap').draggable(false).resizable(false))
          background.off('click')
        }
        else this.interactables[id] = this.makeInteractable(el.elm)
      })
    },

    enableDrawing (enabled = true) {
      const background = SVG.adopt(this.$refs.bgSvg)

      if (enabled) {
        background.style('cursor', 'crosshair')

        let annotator
        this.drawingable = interact(background.node).styleCursor(false)
          .draggable({
            inertia: this.inertia,
            snap: { targets: [this.gridTarget] },
            restrict: 'svg', // allow drawing only in background element (outside annotation)
            autoScroll: true,
            onstart: event => {
              this.$haveVNodeMoreThan(1, this.$slots.drawing, () => {
                throw Error(`only 1 slot="drawing" allowed, you have ${this.$slots.drawing.length} slot="drawing"`)
              })
              this.$pushVNode2Slot('drawing', this.$cloneVNode(this.$slots.drawing[0])) //duplicate node
              annotator = SVG.adopt(this.$slots.drawing[1].elm) // strange be haviour, shift() with drawing[0] will make error
              annotator.draw('point', event)
                .style('cursor', 'crosshair')
            },
            onmove: event => annotator.draw('update', event),
            onend: event => {
              annotator.draw('stop', event).style('cursor', null)
              this.$pushVNode2Slot('annotation', this.$slots.drawing.pop()) // strange be haviour, shift() with drawing[0] will make error
            }
          })
      }
      else this.drawingable.draggable(false)
    }
  },

  updated (el) {
    this.w = this.width || this.$refs.bg.scrollWidth
    this.h = this.width || this.$refs.bg.scrollHeight

    if ((this.$slots.annotation ? this.$slots.annotation.length : 0) > this.interactables.length) {
      this.interactables.push(this.makeInteractable(this.$slots.annotation[this.$slots.annotation.length - 1].elm))
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
