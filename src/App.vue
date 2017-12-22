<template>
  <div id="annotation">
    <annotations :minSize="50">
      <rect class="box" slot="annotation" x="10" y="10" width="100" height="100" />
      <rect class="box" slot="annotation" x="150" y="150" width="50" height="50" />
      <ellipse class="box" slot="annotation" cx="150" cy="150" rx="50" ry="100" />
      <circle class="box" slot="annotation" cx="150" cy="150" r="100" />
      <polygon class="box" slot="annotation" points="200,10 250,190 160,210" />
      <path class="box" slot="annotation" d="M150 0 L75 200 L225 200 Z" />
      <img draggable="false" src="https://docs.microsoft.com/en-us/sql/reporting-services/media/ssrs-web-portal.png" />
      <canvas width="100px" height="100px"></canvas>
      <img draggable="false" src="https://docs.microsoft.com/en-us/sql/reporting-services/media/ssrs-web-portal.png" />
    </annotations>
  </div>
</template>
<script>
import Annotator from './Annotator'

export default {
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

.box {
  stroke: limegreen;
  stroke-width: 3px;
}

.box:hover {
  stroke: orange;
  stroke-width: 3px;
}
</style>
