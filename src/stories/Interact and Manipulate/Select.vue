<template>
  <div id="annotation">
    <pre>Try to open <b>Action Logger</b> panel</pre>
    <pre>and also Vue-devtools > Events</pre>
    <annotations :minSize="minSize" width="600" height="600" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect"
                 @select="selected" @unselect="unselect">
      <polygon ref="myAnnotation" class="stroke" slot="annotation" points="200,10 250,190 160,210" />
      <rect class="stroke" slot="annotation" x="300" y="150" width="170" height="100" />
    </annotations>
  </div>
</template>

<script>
/** BUG(storybook-to-ghpages): must use lazy load import. Don't know why
@code import Annotator from 'components/Annotator'
*/
import SVG from 'svg.js'

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
    annotations: () => import('components/Annotator')
  },
  mounted () {
    console.log('<<< select shape to move another shape >>>'.toUpperCase())
  },
  methods: {
    selected (element) {
      console.log(element.node)
      if (element.node.isSameNode(this.$refs.myAnnotation)) {
        element.next().animate().dmove(30)
      } else {
        SVG.adopt(this.$refs.myAnnotation).animate().dmove(-30)
      }
      this.$action('select', `<${element.type}>`)
    },

    unselect (element) {
      this.$action('unselect', `<${element.type}>`)
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
