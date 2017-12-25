<template>
  <div id="annotation">
    <annotations :minSize="minSize" :width="width" :height="height" :grid="grid" :inertia="inertia">
      <circle class="style" slot="annotation" cx="150" cy="150" r="100" />
    </annotations>
  </div>
</template>
<script>
import Annotator from '../../Annotator'

export default {
  props: [
    'minSize',
    'grid',
    'width',
    'height',
    'inertia'
  ],
  components: {
    annotations: Annotator
  }
}
</script>

<style scoped>
annotation {
  width: 100%;
  height: 100%;
}

.style {
  stroke: limegreen;
  stroke-width: 3px;
}

.style:hover {
  stroke: orange;
  stroke-width: 3px;
}
</style>
