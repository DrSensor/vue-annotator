<template>
  <svg ref="svg" :width="w" :height="h">
    <foreignObject x="0" y="0" :width="w" :height="h">
      <div ref="bg" class="background">
        <slot></slot>
      </div>
    </foreignObject>
    <g ref="fg" class="foreground">
      <slot name="annotation"></slot>
    </g>
  </svg>
</template>

<script>
import interact from 'interactjs'
import SVG from 'svg.js'

export default {
  props: {
    width: Number,
    height: Number,
    inertia: Boolean,
    grid: {
      type: [Array, Number],
      validator: (value) => (value.length == 2 && value.every(v => typeof (v) === 'number')) || (typeof (value) === 'number')
    },
    minSize: {
      type: [Array, Number],
      default: () => 10,
      validator: (value) => (value.length == 2 && value.every(v => typeof (v) === 'number')) || (typeof (value) === 'number')
    },
  },

  data () {
    return {
      w: this.width,
      h: this.height
    }
  },

  updated () {
    this.w = this.width || this.$refs.bg.scrollWidth
    this.h = this.width || this.$refs.bg.scrollHeight
  },

  mounted () {
    const master = SVG(this.$refs.svg)
    if (this.$slots.default) {
      const media = this.$slots.default.filter(el => ['img', 'video', 'audio', 'picture'].includes(el.tag))
      const interval = setInterval(() => {
        let loadComplete = media.every(el => el.elm.complete)
        this.$forceUpdate()
        if (loadComplete) clearInterval(interval)
      }, 43.48)
    } else this.$forceUpdate()

    let gridTarget = this.grid ? interact.createSnapGrid({
      x: this.grid[0],
      y: this.grid[1],
    }) : null

    let [minWidth, minHeight] = typeof (this.minSize) === 'number' ? [this.minSize, this.minSize] : this.minSize

    for (const el of this.$slots.annotation)
      interact(el.elm)
        .draggable({
          inertia: this.inertia,
          snap: { targets: [gridTarget] },

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
          snap: { targets: [gridTarget] },
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          // keep the edges inside the parent
          restrictEdges: {
            outer: 'svg',
          },
          autoScroll: true,

          // minimum size
          restrictSize: {
            min: { width: minWidth, height: minHeight },
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
                break;
              case 'circle':
                const antiPhytagoras = (x, y) => x != 0 && y != 0 && Math.sign(x) != Math.sign(y) ? 0 : Math.sign(x + y) * Math.hypot(event.deltaRect.width, event.deltaRect.height)
                const delta = antiPhytagoras(event.deltaRect.width, event.deltaRect.height)
                const d = s => delta != 0 ? (s / 2) : 0
                const threshold = (minWidth + minHeight) / 2 // because deltaRect will keep going when resizing in diagonal

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
                break;
              default:
                target.move(x, y)
                target.size(event.rect.width, event.rect.height)
                break;
            }
          }
        })

    /** Resize circle on rotation mode
    @example
    let r = target.attr('r') + (event.deltaRect.width || event.deltaRect.height)
    target.radius(r)
    */
    // TODO(rotate): https://codepen.io/drsensor/pen/Vyjaao
  }
}
</script>

<style scoped>
.foreground {
  /* cursor: pointer; */
  fill: transparent;
}

.background {
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
