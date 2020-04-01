'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    dev: {

        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath  : '/',
        proxyTable        : {},

        // Various Dev Server settings
        host           : '192.168.123.90',
        port           : 8004,
        //-hacfin
        autoOpenBrowser: true,// 是否自动打开浏览器
        errorOverlay   : true,// 浏览器错误提示遮罩层
        notifyOnErrors : true,// 编译错误的时候通知提示，需要friendly-errors-webpack-plugin 配合
        poll           : false,

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint                : false,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: false
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot        : path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath  : '/',

        /**
         * Source Maps
         *
         * 项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
         * 有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
         */
        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool            : '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip          : false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}
