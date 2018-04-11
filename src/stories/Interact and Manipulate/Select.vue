<template>
  <div id="annotation">
    <pre>Try to open <b>Action Logger</b> panel</pre>
    <pre>and also Vue-devtools > Events</pre>
    <button @click="onAdd">Add rectangle</button>
    <annotations :minSize="minSize" width="600" height="600" :grid="grid" :inertia="inertia" :multipleSelect="multipleSelect"
                 @select="selected" @unselect="unselect">
      <img draggable="false" src="https://cdn.css-tricks.com/wp-content/uploads/2017/01/vue-2-1.jpg" />
      <polygon ref="myAnnotation" class="stroke" slot="annotation" points="200,10 250,190 160,210" />
      <template slot="annotation" v-for="(offset, key) in offsetList">
        <rect class="stroke" :x="300+offset" :y="150+offset" width="170" height="100" :key="key" />
      </template>
    </annotations>
  </div>
</template>

<script>
import Annotator from 'components/Annotator'
import SVG from 'svg.js'

import { number, boolean } from '@storybook/addon-knobs/dist/vue'

export default {
  data () {
    return {
      minSize: number('minimum diameter', 50),
      grid: [number('gird width', 0), number('gird height', 0)],
      inertia: boolean('enable inertia', true),
      multipleSelect: boolean('enable multiple select', false),
      offsetList: [10,20,30]
    }
  },
  components: {
    annotations: Annotator
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
    },

    onAdd () {
      const lastOffset = this.offsetList[this.offsetList.length - 1]
      this.offsetList.push(lastOffset+10)
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
