<template>
  <div id="annotation">
    <annotations :minSize="minSize" :width="width" :height="height" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect">
      <ellipse class="stroke" slot="annotation" cx="150" cy="150" rx="100" ry="50" />
      <ellipse class="stroke" slot="annotation" cx="300" cy="200" rx="50" ry="50" />
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
