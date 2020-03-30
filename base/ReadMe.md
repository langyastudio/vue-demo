###1、生产环境部署

开启生产环境模式
- webpack 4+，你可以使用 mode 选项
    ```
    module.exports = {
        mode: 'production'
    }
    ```

模板预编译
- 预编译模板最简单的方式就是使用`单文件组件`
- 如果你使用 webpack，并且喜欢分离 JavaScript 和模板文件，
你可以使用 vue-template-loader，它也可以在构建过程中把模板文件转换成为 
JavaScript 渲染函数。

提取组件的 CSS
- 当使用单文件组件时，组件内的 CSS 会以 `<style>` 标签的方式通过 JavaScript 动态注入。
- [webpack + vue-loader](https://vue-loader.vuejs.org/zh-cn/configurations/extract-css.html)

跟踪运行时错误
- 如果在组件渲染时出现运行错误，错误将会被传递至全局 Vue.config.errorHandler 配置函数

> 可以只是简单地使用 Babel，TypeScript，SCSS，PostCSS - 或者其他任何能够帮助你提高生产力的预处理器 