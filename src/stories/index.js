/* eslint-disable react/react-in-jsx-scope */

import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { withNotes } from '@storybook/addon-notes'
import { withDocs } from 'storybook-readme'
import { withInfo } from '@storybook/addon-info'
import { storyOrder } from './config.js'

import {
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
  button
} from '@storybook/addon-knobs'

// import Component from './BasicShape/Circle.vue'
// storiesOf('storyName', module).add('componentName', () => {
//   return {
//     render () {
//       return <story
//         minSize={[100, 100]}
//         grid={[0, 0]}
//         width={600}
//         height={600}
//         inertia
//       />
//     },
//     components: {
//       'story': Component
//     }
//   }
// })

require.context('.', true, /\.vue$/).keys()
  .sort((a, b) => {
    a = a.split('/').map(s => s.replace('.vue', ''))
    b = b.split('/').map(s => s.replace('.vue', ''))
    return storyOrder.indexOf(a[1]) - storyOrder.indexOf(b[1])
  })
  .forEach((filename) => {
    const hierarchy = filename.split('/')
    const basename = hierarchy[hierarchy.length - 1]
    if (/.vue$/.test(basename)) {
      let componentName = hierarchy.length > 2 ? basename.replace('.vue', '') : 'Introduction'
      let storyName = hierarchy.length > 2 ? hierarchy[hierarchy.length - 2] : basename.replace('.vue', '')

      const Stories = storiesOf(storyName, module)
      const Component = require(`${filename}`).default

      const story = () => {
        /** WIP: @since https://github.com/storybooks/storybook/issues/2560 so wait to resolve
        @code
         const minWidth = number('minWidth', {
           range: true,
           min: 5,
           max: 100,
           step: 1
         })
         const minHeight = number('minHeight', {
           range: true,
           min: 5,
           max: 100,
           step: 1
         })
         const gridWidth = number('gridWidth', {
           range: true,
           min: 0,
           max: 100,
           step: 1
         })
         const gridHeight = number('gridHeight', {
           range: true,
           min: 0,
           max: 100,
           step: 1
         })
         const width = number('width', {
           range: true,
           min: 100,
           max: 1280,
           step: 1
         })
         const height = number('height', {
           range: true,
           min: 100,
           max: 720,
           step: 1
         })
        @endcode
        */

        const minWidth = 100
        const minHeight = 100
        const gridWidth = 0
        const gridHeight = 0
        const width = 600
        const height = 600
        const inertia = true

        return {
          render () {
            return <story
              minSize={[minWidth, minHeight]}
              grid={[gridWidth, gridHeight]}
              width={width}
              height={height}
              inertia={inertia}
            />
          },
          components: {
            'story': Component
          }
        }
      }

      // console.log(Component.__notes, Component.__docs, Component.__info)
      const storyWithNotes = withNotes(Component.__notes || '')(story)
      // const storyWithInfo = withInfo(Component.__info || '')(story) // BUG: not support Vue Component
      // const storyWithDocs = withDocs(Component.__docs || '', storyWithNotes) // WIP: https://github.com/tuchk4/storybook-readme/issues/37
      Stories.add(componentName, storyWithNotes)
    }
  })

/* eslint-enable react/react-in-jsx-scope */
