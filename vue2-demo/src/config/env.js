/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 *
 */
let baseUrl    = '';
let tokenUrl = '';
let routerMode = 'history';

if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://192.168.123.110:8221';
    tokenUrl = 'http://39.107.112.100:3001'
} else {
    baseUrl = 'http://192.168.123.110:8221';
    tokenUrl = 'http://39.107.112.100:3001'
}

export {
    baseUrl,
    tokenUrl,
    routerMode
}