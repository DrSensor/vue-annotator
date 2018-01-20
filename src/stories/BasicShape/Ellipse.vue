<template>
  <div id="annotation">
    <annotations :minSize="minSize" width="600" height="600" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect">
      <ellipse class="stroke" slot="annotation" cx="150" cy="150" rx="100" ry="50" />
      <ellipse class="stroke" slot="annotation" cx="300" cy="200" rx="50" ry="50" />
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
