'use strict'
const path            = require('path')
const utils           = require('./utils')
const config          = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
    test   : /\.(js|vue)$/,
    loader : 'eslint-loader',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
    options: {
        formatter  : require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

var entry = utils.entries()
entry['common/config'] =  './src/config/config.js'
module.exports = {
    //hacfin
    entry    : entry,
    output   : {
        path      : config.build.assetsRoot,
        filename  : '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve  : {
        extensions: ['.js', '.vue', '.json'],
        alias     : {
            'vue$'  : 'vue/dist/vue.esm.js',
            '@'     : resolve('src'),
            //hacfin
            'static': resolve('static'),
            'index' : resolve('src/modules/index'),
            'phone' : resolve('src/modules/phone'),
        }
    },
    module   : {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test   : /\.vue$/,
                loader : 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test   : /\.js$/,
                loader : 'babel-loader',
                include: [resolve('src'), resolve('test'),resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test   : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader : 'url-loader',
                options: {
                    limit: 1,//（图片分享时转换成base64会太大，导致无法分享，所以limit改为1）
                    name : utils.assetsPath('images/[name].[hash:7].[ext]')
                }
            },
            {
                test   : /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader : 'url-loader',
                options: {
                    limit: 10000,
                    name : utils.assetsPath('medias/[name].[hash:7].[ext]')
                }
            },
            {
                test   : /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader : 'url-loader',
                options: {
                    limit: 10000,
                    name : utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            //hacfin
            {
                test  : /\.pug$/,
                loader: 'pug-loader'
            },
        ]
    },
    plugins  : [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ],
    //以下选项是Node.js全局变量或模块，这里主要是防止webpack注入一些Node.js的东西到vue中
    node     : {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate : false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram        : 'empty',
        fs           : 'empty',
        net          : 'empty',
        tls          : 'empty',
        child_process: 'empty'
    },
    //hacfin 为了import这些文件不会编译到vendor
    externals: {
        'vue'       : 'Vue',
        'element-ui': 'ELEMENT',
        'mint-ui'   : 'MINT',
        'vue-router': 'VueRouter',
        'axios'     : 'axios'
    }
};
