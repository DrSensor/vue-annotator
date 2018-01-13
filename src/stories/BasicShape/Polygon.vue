<template>
  <div id="annotation">
    <annotations :minSize="minSize" :width="width" :height="height" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect">
      <polygon class="stroke" slot="annotation" points="350,50 283,250 450,122 250,122 416,250" />
      <polygon class="stroke" slot="annotation" points="200,10 250,190 160,210" />
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
