# vue-annotator

Create annotation using SVG and HTML element.

## Props
| Parameters | Description | Type | Must Specify | Default value |
|---------- |-------- |---------- |---------- |---------- |
| `width` | width of drawing canvas | `Number` | optional | width of background |
| `height` | width of drawing canvas | `Number` | optional | height of background |
| `grid` | set grid for sanpping. <br> - `:grid="[w,h]"` for setting width and height. <br> - `:grid="w"` for setting grid in square | `Array[2]` or `Number` | optional | `null` |
| `minSize` | set minimum size of annotation. <br> - `:minSize="[w,h]"` for set minimum width and height of annotation size. <br> - `:grid="w"` for set minimum width and height of annotation size equal to `w` | `Array[2]` or `Number` | optional | false |

## Slots
| Method name | Description | Accepted Element |
|---------- |-------- |---------- |
| `default` | background element of annotation | Any HTML element |
| `annotation` | annotation element (accept SVG element) | `<rect>` <br> `<ellipse>` <br> `<circle>` <br> `<polygon>` <br> `<path>` <br> `<foreignObject>` |
| `drawing` (WIP) | draw element via mouse click&drag <br><sup> will error when more than 1 element to be provided </sup> | same as `annotation` | 
| `select` (WIP) | element that to display when annotation is selected <br><sup> will error when more than 1 element to be provided </sup> | same as `annotation` | 

## Events
| Event name | Description | Parameters |
|---------- |-------- |---------- |
| `drawdone` (WIP) | emit when drawing element is finish | node: `DOM.Element` |
| `drawcancel` (WIP) | emit when drawing element is canceled (via right click) | node: `DOM.Element` |

> Tips: use `node.isSameNode(this.$refs.myAnnotation)` for identifying the element.

