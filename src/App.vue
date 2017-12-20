<template>
  <div id="annotation">
    <annotations>
      <rect class="box" slot="annotation" x="10" y="10" width="100" height="100"></rect>
      <!-- <rect class="box" slot="annotation" x="150" y="150" width="50" height="50"></rect> -->
      <rect class="box" slot="resizemode" x="5" y="5" width="50" height="50"></rect>
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
