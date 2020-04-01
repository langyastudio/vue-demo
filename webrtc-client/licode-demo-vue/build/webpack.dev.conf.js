'use strict'
const utils                = require('./utils')
const webpack              = require('webpack')
const config               = require('../config')
const merge                = require('webpack-merge')
const path                 = require('path')
const baseWebpackConfig    = require('./webpack.base.conf')
const CopyWebpackPlugin    = require('copy-webpack-plugin')
const HtmlWebpackPlugin    = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder           = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: "development",
    module : {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // 服务器配置
    devServer: {
        clientLogLevel    : 'warning',
        historyApiFallback: {
            //hacfin 路由配置
            index   : '/index/index.html',
            rewrites: [
                {from: /^\/video(\/.*)*$/, to: '/index/video.html'},
                {from: /^\/audio(\/.*)*$/, to: '/index/audio.html'},
                {from: /^\/upload(\/.*)*$/, to: '/index/upload.html'},
                {from: /^\/valaditor(\/.*)*$/, to: '/index/valaditor.html'},
                {from: /^\/editor(\/.*)*$/, to: '/index/editor.html'},
                {from: /^\/m\/index(\/.*)*$/, to: '/phone/index.html'},
                {from: /^\/m\/video(\/.*)*$/, to: '/phone/video.html'},
                {from: /^\/m\/noexsit$/, to: '/phone/noexsit.html'},
                { from: /^\/admin(\/.*)*$/, to: '/index/admin.html' },
            ]
        },
        // hot               : true,//热替换
        hotOnly:true,
        compress          : true,
        host              : HOST || config.dev.host,
        port              : PORT || config.dev.port,
        open              : config.dev.autoOpenBrowser,
        overlay           : config.dev.errorOverlay
            ? {warnings: false, errors: true}
            : false,
        publicPath        : config.dev.assetsPublicPath,
        proxy             : config.dev.proxyTable,
        quiet             : true, // necessary for FriendlyErrorsPlugin
        watchOptions      : {
            poll: config.dev.poll,
        }
    },
    plugins  : [
        //定义环境变量
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),

        // 热替换
        new webpack.HotModuleReplacementPlugin(),

        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.

        new webpack.NoEmitOnErrorsPlugin(),

        // // 复制静态组件
        // new CopyWebpackPlugin([
        //     {
        //         from  : path.resolve(__dirname, '../static'),
        //         to    : config.dev.assetsSubDirectory,
        //         ignore: ['.*']
        //     }
        // ])
    ]
});

//hacfin
//根据入口生成多页面
Object.keys(utils.entries()).forEach(function (entry) {
    var entryname  = entry.substring(entry.lastIndexOf('/') + 1);
    var entrypre   = entry.substring(0, entry.lastIndexOf('/'));
    var etToZh     = {
        'index': '首页',
        'video': '视频'
    }
    var page_title = etToZh[entryname] ? etToZh[entryname] : '';
    devWebpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            title   : page_title,
            filename: entry + '.html',
            template: 'src/modules/' + entrypre + '/pages/' + entryname + '/' + entryname + '.pug',
            favicon : 'favicon.ico',
            inject  : true,
            chunks  : ['common/config',entry],
            chunksSortMode: 'manual'
        })


    )
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT                = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors              : config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})
