<template>
  <div id="annotation">
    <button @click="drawing = !drawing">{{drawing ? "stop" : "drawing" }}</button>
    <annotations :drawing="drawing" :inertia="inertia" :minSize="minSize" :width="width" :height="height" :grid="grid"
                 @drawfinish="drawfinish" @drawcancel="drawcancel">
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
/** BUG(storybook-to-ghpages): must use lazy load import. Don't know why
@code import Annotator from 'components/Annotator'
*/
import SVG from 'svg.js'

export default {
  props: [
    'minSize',
    'grid',
    'width',
    'height',
    'inertia'
  ],
  data () {
    return {
      drawing: true,
    }
  },
  components: {
    annotations: () => import('components/Annotator')
  },

  methods: {
    drawfinish (element) {
      setTimeout(() => alert(`finish drawing <${element.type}>`), 500)
    },
    drawcancel () {
      setTimeout(() => alert('cancel drawing'), 500)
    }
  }
}
</script>

<style scoped>
annotation {
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
