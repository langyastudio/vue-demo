
var cloudConfigUrl
if (process.env.NODE_ENV == 'development') {

    cloudConfigUrl = 'http://192.168.123.90:8217/static/cloud-config.js'

} else {
    cloudConfigUrl = 'http://192.168.123.90:8218/static/cloud-config.js'
}
document.write('<scr'+'ipt type="text/javascript" src="'+cloudConfigUrl+'"></sc'+'ript>');
