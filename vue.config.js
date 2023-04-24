const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    // WebAssembly Loaderを追加
    config.module
      .rule('wasm')
      .test(/\.wasm$/)
      .type("asset/inline")
//      .use('wasm-loader')
//      .loader('wasm-loader')
      .end(),
    // config.module
    //   .rule("less")
    //   .test(/\.less$/)
    //   .use([
    //     'vue-style-loader',
    //     'css-loader',
    //     'less-loader'
    //   ]).end()
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    watchOptions :{
      aggregateTimeout: 300,
      poll: 1000
    }
  }
})
