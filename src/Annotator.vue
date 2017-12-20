<template>
  <svg ref="svg" :width="w" :height="h">
    <foreignObject x="0" y="0" :width="w" :height="h">
      <div ref="bg" class="background">
        <slot></slot>
      </div>
    </foreignObject>
    <g class="foreground">
      <slot name="annotation"></slot>
    </g>
  </svg>
</template>

<script>
import interact from 'interactjs'
// import SVG from 'svgjs'

export default {
  props: {
    width: Number,
    height: Number,
  },

  data () {
    return {
      w: this.width,
      h: this.height
    }
  },

  mounted () {
    // const svg = SVG(this.$refs.svg)
    this.w = this.$refs.bg.scrollWidth
    this.h = this.$refs.bg.scrollHeight

    for (const i in this.$slots.annotation) {
      const el = this.$slots.annotation[i].elm
      if (el) {
        // const elSvg = SVG.adopt(el)
        interact(el).draggable({
          // enable inertial throwing
          inertia: true,
          // keep the element within the area of it's parent
          restrict: {
            restriction: 'svg',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          // enable autoScroll
          autoScroll: true,

          // call this function on every dragmove event
          onmove (event) {
            var target = event.target,
              // keep the dragged position in the data-x/data-y attributes
              x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
              y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
              target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }).resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          // keep the edges inside the parent
          restrictEdges: {
            outer: 'svg',
          },

          // minimum size
          restrictSize: {
            min: { width: 10, height: 10 },
          },

          inertia: true

        }).on('resizemove', function (event) {
          var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

          // update the element's style
          target.style.width = event.rect.width + 'px';
          target.style.height = event.rect.height + 'px';

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
          target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        })

        // TODO: https://codepen.io/drsensor/pen/Vyjaao
      }
    }
  }

}
</script>


<style>

</style>


<style scoped>
.foreground {
  /* cursor: pointer; */
  fill: transparent;
}

.background {
  width: 100%;
  height: 100%;
  user-select: none;
}
</style>
