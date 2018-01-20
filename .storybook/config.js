import { configure, addDecorator } from '@storybook/vue'
import { setOptions as masterOptions } from '@storybook/addon-options'

import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/dist/vue'

import VueInfoAddon from 'storybook-addon-vue-info'
import Readme from '../README.md'

addDecorator(withReadme(Readme))
// addDecorator(VueInfoAddon) // pending until https://github.com/DrSensor/vue-authoring-template/issues/7 resolved
addDecorator(withKnobs)

masterOptions({
  name: 'vue-annotator',
  url: '#',
  showLeftPanel: true,
  downPanelInRight: true,
  hierarchySeparator: /\/|\./
})


configure(() => require('../src/stories'), module)
