<template>
  <svg ref="svg" :width="w" :height="h">

    <foreignObject oncontextmenu="return false;" ref="bgSvg" x="0" y="0" :width="w" :height="h">
      <div ref="bg" class="background">
        <slot></slot>
      </div>
    </foreignObject>

    <g ref="annotations" class="foreground">
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

// import { printSlotElement } from 'utils/debug'
import manipulate from '../mixins/manipulate'
import drawing from '../mixins/drawing'
import select from '../mixins/select'
import del from '../mixins/delete'


export default {
  name: 'Annotator',
  mixins: [manipulate, drawing, select, del],
  props: {
    width: {
      type: [Number, String],
      validator: (value) => !isNaN(value) || value === undefined
    },
    height: {
      type: [Number, String],
      validator: (value) => !isNaN(value) || value === undefined
    },
    drawing: Boolean,
    noInteract: Boolean,
    noSelect: Boolean
  },

  watch: {
    drawing: function (value) {
      this.enableDrawing(value)
    },
    noInteract: function (value) {
      this.enableInteraction(value)
    },
    noSelect: function (value) {
      this.enableSelection(value)
    },
  },

  data () {
    return {
      w: parseInt(this.width) || 0,
      h: parseInt(this.height) || 0,
      background: SVG.adopt(this.$refs.bgSvg),
      annotations: SVG.adopt(this.$refs.annotations)
    }
  },

  methods: {

  },

  updated () {
    this.w = parseInt(this.width) || this.$refs.bg.scrollWidth
    this.h = parseInt(this.width) || this.$refs.bg.scrollHeight
  },

  beforeMount () {
    if (this.$slots.default) {
      const media = this.$slots.default.filter(el => ['img', 'video', 'audio', 'picture'].includes(el.tag))
      const interval = setInterval(() => {
        const loadComplete = media.every(el => el.elm.complete)
        if (loadComplete) {
          clearInterval(interval)
          this.$forceUpdate()
        }
      }, 43.48)
    } else this.$forceUpdate()
  },

  mounted () {
    this.background = SVG.adopt(this.$refs.bgSvg)
    this.annotations = SVG.adopt(this.$refs.annotations)

    this.enableInteraction(!this.noInteract)
    this.enableSelection(!this.noSelect)
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
