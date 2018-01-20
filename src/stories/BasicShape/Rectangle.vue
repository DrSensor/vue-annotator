<template>
  <div id="annotation">
    <annotations :minSize="minSize" width="600" height="600" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect">
      <rect class="stroke" slot="annotation" x="100" y="100" width="100" height="100" />
      <rect class="stroke" slot="annotation" x="300" y="150" width="170" height="100" />
    </annotations>
  </div>
</template>

<script>
import Annotator from 'components/Annotator'

import { number, boolean } from '@storybook/addon-knobs/dist/vue'

export default {
  data () {
    return {
      minSize: number('minimum diameter', 50),
      grid: [number('gird width', 0), number('gird height', 0)],
      inertia: boolean('enable inertia', true),
      multipleSelect: boolean('enable multiple select', false)
    }
  },
  components: {
    annotations: Annotator
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
