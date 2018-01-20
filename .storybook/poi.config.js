const path = require('path')
const updateWebpackConfig = require('storybook-readme/env/vue/updateWebpackConfig')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  /** BUG(vue-loader maybe): Can't use lazy load import when specify custom loader
  @config */
  vue: {
    loaders: {
      docs: [require.resolve('../.loader/docs-loader.js'), 'html-loader', 'markdown-loader']
      // notes: require.resolve('../.loader/notes-loader.js'),
      // info: require.resolve('../.loader/info-loader.js')
    }
  },

  // Entry is relative to process.cwd()
  entry: [
    '.storybook/config.js',
    '.storybook/addons.js'
  ],

  babel: {
    babelrc: false,
    cacheDirectory: true,
    plugins: [
      [require.resolve('babel-plugin-transform-imports'), {
        'components': {
          transform: "components/${member}",
          preventFullImport: true
        },
        'mixins': {
          transform: "mixins/${member}",
          preventFullImport: true
        }
      }]
    ],
    presets: [
      [require.resolve('babel-preset-poi'), { jsx: 'vue' }]
    ]
  },

  // webpack (config) {
  //   console.log(JSON.stringify(config))
  //   // return updateWebpackConfig(config)
  // },

  // extendWebpack (config) {
  //   config.merge(updateWebpackConfig(config.toConfig()))
  // },

  dist: '.storybook/dist',

  presets: [
    require('poi-preset-storybook')(),
    require('poi-preset-resolve-alias')({
      'components': resolve('src/components'),
      'stories': resolve('src/stories'),
      'utils': resolve('src/utils'),
      'mixins': resolve('src/mixins'),
      '~': resolve('')
    })
  ]
}
