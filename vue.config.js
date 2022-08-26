function isProduction() {
  return process.env.NODE_ENV === 'production'
}

module.exports = {
  // https://cli.vuejs.org/config/#productionsourcemap
  productionSourceMap: false,

  // https://cli.vuejs.org/config/#css-extract
  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: {
        additionalData: '@import \'~@/assets/scss/vuetify/variables\''
      },
      scss: {
        additionalData: '@import \'~@/assets/scss/vuetify/variables\';'
      }
    }
  },

  chainWebpack: (config) => {
    // Remove the following lines to add Vue Prefetch and Preload on index.html
    // https://cli.vuejs.org/guide/html-and-static-assets.html#disable-index-generation
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },

  // https://cli.vuejs.org/config/#transpiledependencies
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
    'vuetify'
  ],

  publicPath: isProduction() ? process.env.BASE_URL : '/',
  outputDir: process.env.OUTPUT_DIR || 'dist',
  indexPath: process.env.INDEX_PATH || 'index.html'
}
