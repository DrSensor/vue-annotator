/* eslint-disable react/react-in-jsx-scope */

import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { withNotes } from '@storybook/addon-notes'
import { withDocs } from 'storybook-readme'
import { withInfo } from '@storybook/addon-info'

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

// import Component from './Welcome.vue'
// storiesOf('storyName', module).add('componentName', () => {
//   return {
//     template: '<story></story>',
//     components: {
//       'story': () => import('./Welcome.vue')
//     }
//   }
// })

import { storyOrder } from './config.js'

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

      const Component = require(`${filename}`).default

      const story = () => {
        // const name = text('Name', 'Jane')
        // const stock = number('Stock', 20, {
        //   range: true,
        //   min: 0,
        //   max: 30,
        //   step: 5,
        // })
        // const fruits = {
        //   apples: 'Apple',
        //   bananas: 'Banana',
        //   cherries: 'Cherry',
        // }
        // const fruit = select('Fruit', fruits, 'apple')
        // const price = number('Price', 2.25)

        // const colour = color('Border', 'deeppink')
        // const today = date('Today', new Date('Jan 20 2017'))
        // const items = array('Items', ['Laptop', 'Book', 'Whiskey'])
        // const nice = boolean('Nice', true)

        // const stockMessage = stock
        //   ? `I have a stock of ${stock} ${fruit}, costing &dollar${price} each.`
        //   : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`
        // const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!'

        // button('Arbitrary action', action('You clicked it!'))

        return {
          template: '<story></story>',
          components: {
            'story': Component
          }
        }
      }

      // console.log(Component.__notes, Component.__docs, Component.__info)
      const storyWithNotes = withNotes(Component.__notes || '')(story)
      // const storyWithInfo = withInfo(Component.__info || '')(story) // BUG: not support Vue Component
      // const storyWithDocs = withDocs(Component.__docs || '', storyWithNotes) // WIP: https://github.com/tuchk4/storybook-readme/issues/37
      storiesOf(storyName, module).add(componentName, storyWithNotes)
    }
  })

/* eslint-enable react/react-in-jsx-scope */
