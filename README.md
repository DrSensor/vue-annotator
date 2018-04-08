# vue-annotator
[![CircleCI](https://circleci.com/gh/DrSensor/vue-annotator.svg?style=shield)](https://circleci.com/gh/DrSensor/vue-annotator)
[![donate](https://img.shields.io/badge/donate-$-yellowgreen.svg?maxAge=2592000&style=flat)](https://github.com/DrSensor/vue-annotator/blob/master/DONATE.md)

Create annotation using SVG and HTML element.

## Usage

```html
<v-annotator inertia
  :drawing="enableDrawingMode"
  @select="openDialog"
  :minSize="[50, 50]"
  :grid="[5, 5]"
  :multipleSelect="keyIsDown.Ctrl"
>

    <img draggable="false" src="background.png" />

    <rect slot="annotation" stroke="green" x="300" y="150" width="170" height="100" />
    <polygon slot="annotation" stroke="purple" points="200,10 250,190 160,210" />

    <rect slot="drawing" stroke="red" />

</v-annotator>
```

```css
<style scoped>
@import '~vue-annotator/style.css';

/* Your beloved style */
</style>
```

<details>
<summary>Enable <code>--skipLibCheck</code> if using typescript</summary>

In *tsconfig.json*

```js
{
  compilerOptions: {
    skipLibCheck: true
  }
}
```

Now it should work fine

```ts
import { Vue, Component } from 'vue-property-decorator'
import VAnnotator from 'vue-annotator'

@Component({ components: { VAnnotator } })
export class MyCanvas extends Vue {
  /** Your beloved logic */
}
```

</details>


### Props
> \* : must be set if no background

| Parameters | Description | Type | Must Specify | Default value |
|---------- |-------- |---------- |---------- |---------- |
| `width` | width of drawing canvas | `Number` | *optional | width of background |
| `height` | width of drawing canvas | `Number` | *optional | height of background |
| `grid` | set grid for sanpping. `:grid="[w,h]"` for setting width and height. `:grid="w"` for setting grid in square | `Array[2]` or `Number` | optional | `null` |
| `minSize` | set minimum size of annotation. `:minSize="[w,h]"` for set minimum width and height of annotation size. `:grid="w"` for set minimum width and height of annotation size equal to `w` | `Array[2]` or `Number` | optional | `false` |
| `drawing` | switch to drawing mode | `Boolean` | optional | `false` |
| `inertia` | enable inertia moment animation when interacting | `Boolean` | optional | `false` |
| `multipleSelect` | enable multiple select | `Boolean` | optional | `false` |
| `delete.sync` | delete selected element when set to `true` | `Boolean` | optional |


### Slots
> \* : will error when more than 1 element to be provided

| Method name | Description | Accepted Element |
|---------- |-------- |---------- |
| `default` | background element of annotation | Any HTML element |
| `annotation` | annotation element (accept SVG element) | `<rect>`, `<ellipse>`, `<circle>`, `<polygon>`, `<path>`, `<foreignObject>` |
| `drawing` | *draw element via mouse click&drag | `<rect>`, `<ellipse>`, `<circle>` | 

### Events
| Event name | Description | Parameters |
|---------- |-------- |---------- |
| `select` | emit when element is click/select | element: [`SVG.Element`](http://svgjs.com/elements/#elements) |
| `unselect` | emit when element is unselected (by clicking the background) | element: [`SVG.Element`](http://svgjs.com/elements/#elements) |
| `drawfinish` | emit when drawing element is finish | element: [`SVG.Element`](http://svgjs.com/elements/#elements) |
| `drawcancel` | emit when drawing element is canceled (via right click) |
| `update:delete` | emit when shape was successfully deleted |

> Tips: use `element.node.isSameNode(this.$refs.myAnnotation)` for identifying the element.

### Style CSS
> Vue-Annotator use `svg.select.js` with this predefined style that can be override

| Class name | Description | Notes
|---------- |-------- |--------- |
| `.svg_select_boundingRect` | define style of rectangle in selected element | only applicable on `<rect>`, `<circle>`, `<ellipse>` |
| `.svg_select_points` | define style of edge circles in selected element |

default style
```CSS
.svg_select_points {
  stroke-width: 1;
  fill: black;
  stroke-dasharray: 10 10;
  stroke: black;
  stroke-opacity: 0.8;
  pointer-events: none; /* This ons is needed if you want to deselect or drag the shape*/
}

.svg_select_boundingRect {
  display: none;
}
```

## Support
See [CONTRIBUTING.md](https://github.com/DrSensor/vue-annotator/blob/master/CONTRIBUTING.md) for contributing directly via:
- [Pull Requests](https://github.com/DrSensor/vue-annotator/blob/master/CONTRIBUTING.md/#pull-requests) or
- [Create Issues](https://github.com/DrSensor/vue-annotator/blob/master/CONTRIBUTING.md/#create-issues)

## License
[MIT](https://github.com/DrSensor/vue-annotator/blob/master/LICENSE) License
