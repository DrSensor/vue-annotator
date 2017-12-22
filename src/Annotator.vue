<template>
  <svg ref="svg" :width="w" :height="h">
    <foreignObject x="0" y="0" :width="w" :height="h">
      <div ref="bg" class="background">
        <slot></slot>
      </div>
    </foreignObject>
    <g class="foreground">
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
    minAnonSize: {
      type: Array,
      default: function () {
        return [10, 10]
      },
      validator: function (value) {
        return value.length == 2 && value.every(v => typeof (v) === 'number')
      }
    },
  },

  data () {
    return {
      w: this.width,
      h: this.height
    }
  },

  mounted () {
    // const svg = SVG(this.$refs.svg)
    this.w = this.$refs.bg.scrollWidth
    this.h = this.$refs.bg.scrollHeight

    for (const i in this.$slots.annotation) {
      const el = this.$slots.annotation[i].elm
      if (el) {
        interact(el)
          .draggable({
            inertia: true,
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
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            // keep the edges inside the parent
            restrictEdges: {
              outer: 'svg',
            },

            // minimum size
            restrictSize: {
              min: { width: this.minAnonSize[0], height: this.minAnonSize[1] },
            },
            inertia: true,

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
                  const threshold = this.minAnonSize.reduce((sum, val) => sum + val) / 2 // because deltaRect will keep going when resizing in diagonal

                  if (event.rect.width > threshold && event.rect.height > threshold) {
                    x += d(event.deltaRect.width)
                    y += d(event.deltaRect.height)
                  } else {
                    x = target.x()
                    y = target.y()
                  }

                  let diameter = target.attr('r') * 2 + delta
                  diameter = Math.max(diameter, threshold)

                  target.move(x, y)
                  target.size(diameter)

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
  }

}
</script>


<style>

</style>


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
