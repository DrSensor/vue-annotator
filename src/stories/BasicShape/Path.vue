<template>
  <div id="annotation">
    <annotations :minSize="minSize" :width="width" :height="height" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect">
      <path class="stroke" slot="annotation" d="M150 0 L75 200 L225 200 Z" />
    </annotations>
  </div>
</template>

<script>
/** BUG(storybook-to-ghpages): must use lazy load import. Don't know why
@code import Annotator from 'components/Annotator'
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
    annotations: () => import('components/Annotator')
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
