<template>
  <div id="annotation">
    <button @click="drawing = !drawing">{{drawing ? "stop" : "drawing" }}</button>
    <annotations :drawing="drawing" :inertia="inertia" :minSize="minSize" :grid="grid" :multipleSelect="multipleSelect"
                @draw-end="drawfinish" @draw-cancel="drawcancel" @draw="onDraw">
      <img draggable="false" src="https://cdn.css-tricks.com/wp-content/uploads/2017/01/vue-2-1.jpg" />
      <!-- <polygon class="stroke" slot="drawing" /> not supported yet -->
      <rect class="stroke" slot="drawing" />
      <!-- <circle class="stroke" slot="drawing" /> -->
      <rect class="stroke" slot="annotation" x="300" y="150" width="170" height="100" />

      <!-- <ellipse class="stroke" slot="drawing" /> -->
    </annotations>
  </div>
</template>

<script>
import Annotator from 'components/Annotator'
import SVG from 'svg.js'

import { number, boolean } from '@storybook/addon-knobs/dist/vue'

export default {
  data () {
    return {
      drawing: true,
      minSize: number('minimum diameter', 50),
      grid: [number('gird width', 0), number('gird height', 0)],
      inertia: boolean('enable inertia', true),
      multipleSelect: boolean('enable multiple select', false)
    }
  },
  components: {
    annotations: Annotator
  },

  methods: {
    drawfinish (element) {
      this.$action(`finish drawing`, `<${element.type}>`, 'sdsd')
    },
    drawcancel () {
      this.$action('cancel drawing')
    },
    onDraw (element) {
      console.log(element.node)
    }
  }
}
</script>

<style scoped>
svg {
  background: whitesmoke;
}

#annotation {
  width: 100%;
  height: 100%;
}

.stroke {
  stroke: limegreen;
  stroke-width: 3px;
}

.stroke:hover {
  stroke: orange;
  stroke-width: 3px;
}
</style>
