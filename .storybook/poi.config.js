module.exports = {
  vue: {
    loaders: {
      'docs': require.resolve('../.loader/docs-loader.js'),
      'notes': require.resolve('../.loader/notes-loader.js'),
      'info': require.resolve('../.loader/info-loader.js')
    }
  },
  
  // Entry is relative to process.cwd()
  entry: [
    '.storybook/config.js',
    '.storybook/addons.js'
  ],

  extendWebpack (config) {
    config.module.rule('markdown')
      .test(/\.md$/)
      .use('md')
      .loader(require.resolve('raw-loader'))
  },

  dist: '.storybook/dist',

  presets: [
    require('poi-preset-storybook')()
  ]
}