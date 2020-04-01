'use strict'
const path                 = require('path')
const config               = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageConfig        = require('../package.json')
const glob                 = require('glob')

//生成绝对路径
exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
    options = options || {}

    const cssLoader = {
        loader : 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    const postcssLoader = {
        loader : 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

        if (loader) {
            loaders.push({
                loader : loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            //hacfin
            if (options.extractobj) {
                return options.extractobj.extract({
                    use     : loaders,
                    fallback: 'vue-style-loader'
                })
            } else {
                return ['vue-style-loader', {
                    loader: MiniCssExtractPlugin.loader
                }].concat(loaders)
            }
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css    : generateLoaders(),
        postcss: generateLoaders(),
        less   : generateLoaders('less'),
        sass   : generateLoaders('sass', {indentedSyntax: true}),
        scss   : generateLoaders('sass'),
        stylus : generateLoaders('stylus'),
        styl   : generateLoaders('stylus')
    }
}

//各种类型css文件生成对应的loader
exports.styleLoaders = function (options) {
    const output  = []
    const loaders = exports.cssLoaders(options)

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use : loader
        })
    }

    return output
}

//编译错误时产生的通知

exports.createNotifierCallback = () => {
    const notifier = require('node-notifier')

    return (severity, errors) => {
        if (severity !== 'error') return

        const error    = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title   : packageConfig.name,
            message : severity + ': ' + error.name,
            subtitle: filename || '',
            icon    : path.join(__dirname, '../static/images/logo.png')
        })
    }
}

//hacfin
// 根据modules目录下的JS生成多个入口，并且入口的key分index和phone
exports.entries = function () {
    var files  = glob.sync('./src/modules/**/*.js');
    var entris = {};

    files.forEach(function (f) {
        if (f.search('phone') != -1) {
            var filename     = 'phone/' + f.substring(f.lastIndexOf('/') + 1, f.lastIndexOf('.'));
            entris[filename] = f;
        } else {
            var filename     = 'index/' + f.substring(f.lastIndexOf('/') + 1, f.lastIndexOf('.'));
            entris[filename] = f;
        }
    });

    return entris;
};
