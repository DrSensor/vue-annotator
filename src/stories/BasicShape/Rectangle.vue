<template>
  <div id="annotation">
    <annotations :minSize="minSize" :width="width" :height="height" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect">
      <rect class="stroke" slot="annotation" x="100" y="100" width="100" height="100" />
      <rect class="stroke" slot="annotation" x="300" y="150" width="170" height="100" />
    </annotations>
  </div>
</template>

<script>
/** BUG(storybook-to-ghpages): must use lazy load import. Don't know why
@code import Annotator from '../../Annotator'
*/

export default {
  props: [
    'minSize',
    'grid',
    'width',
    'height',
    'inertia',
    'multipleSelect'
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
