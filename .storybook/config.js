import { configure, addDecorator } from '@storybook/vue'
import { setOptions as masterOptions } from '@storybook/addon-options'
import { setDefaults as infoOptions } from '@storybook/addon-info'
import { withDocs, withReadme } from 'storybook-readme'
import { withConsole } from '@storybook/addon-console'
import { withKnobs } from '@storybook/addon-knobs'

// import centered from '@storybook/addon-centered'

import Readme from '../README.md'
import Footer from '../FOOTER.md'

const optionsCallback = (options) => ({ panelExclude: [...options.panelExclude, /Warning/] })
addDecorator((storyFn, context) => withConsole(optionsCallback)(storyFn)(context))

addDecorator(withReadme(Readme))
withDocs.addFooter(Footer)

// addDecorator(withKnobs)

// addDecorator(centered) // BUG: Cannot add property components, object is not extensible (Vue Component not supported)
masterOptions({
  name: 'Vue-Annotator',
  url: '#',
  showLeftPanel: true,
  downPanelInRight: true,
  hierarchySeparator: /\/|\./
})

// BUG: Vue Component not supported
// infoOptions({
//   header: false, // Toggles display of header with component name and description
//   inline: true, // Displays info inline vs click button to view
//   source: true, // Displays the source of story Component
//   propTables: [], // displays Prop Tables with this components
//   propTablesExclude: [], // Exclude Components from being shown in Prop Tables section
//   styles: {}, // Overrides styles of addon
//   marksyConf: {}, // Overrides components used to display markdown. Warning! This option's name will be likely deprecated in favor to "components" with the same API in 3.3 release. Follow this PR #1501 for details
//   maxPropsIntoLine: 1, // Max props to display per line in source code
//   maxPropObjectKeys: 10, // Displays the first 10 characters of the prop name
//   maxPropArrayLength: 10, // Displays the first 10 items in the default prop array
//   maxPropStringLength: 100, // Displays the first 100 characters in the default prop string
// })

configure(() => require('../src/stories'), module)
