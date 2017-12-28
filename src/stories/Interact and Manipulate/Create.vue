<template>
  <div id="annotation">
    <annotations drawing :inertia="inertia" :minSize="minSize" :width="width" :height="height" :grid="grid">
      <!-- <polygon class="stroke" slot="drawing" /> not supported yet -->
      <rect class="stroke" slot="drawing" />
      <!-- <circle class="stroke" slot="drawing" /> -->
      <!-- <ellipse class="stroke" slot="drawing" /> -->
    </annotations>
  </div>
</template>

<script>
/** BUG(storybook-to-ghpages): must use lazy load import. Don't know why
@code import Annotator from '../../Annotator'
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
  components: {
    annotations: () => import('../../Annotator')
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
