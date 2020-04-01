import VueCookies from 'vue-cookies'
import Bowser from 'bowser'


export const getuuid = function(){
    var UUID = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return UUID;
}
export const fileSize = function(fileSize,isnotdit) {
    if (typeof(fileSize) == "undefined") {
        return "-"
    }
    if (!_isNumeric(fileSize)) {
        return "-"
    }
    // var kb = 1024;
    // var mb = kb * 1024;
    // var gb = mb * 1024;
    // var tb = gb * 1024;
    // if (fileSize >= tb) {
    //     return parseFloat((fileSize / tb).toFixed(2)) + "T"
    // } else if (fileSize >= gb) {
    //     return parseFloat((fileSize / gb).toFixed(2)) + "G"
    // } else if (fileSize >= mb) {
    //     return parseFloat((fileSize / mb).toFixed(2)) + "M"
    // } else if (fileSize >= kb) {
    //     return parseFloat((fileSize / kb).toFixed(2)) + "KB"
    // } else {
    //     return fileSize + "B"
    // }


    var kb = 1024;
    var mb = kb * 1024;
    var gb = mb * 1024;
    var tb = gb * 1024;
    if (fileSize >= tb) {
        return  fixed2((fileSize / tb).toString())+ "T"
    } else if (fileSize >= gb) {
        return fixed2((fileSize / gb).toString()) + "G"
    } else if (fileSize >= mb) {
        return fixed2((fileSize / mb).toString()) + "M"
    } else if (fileSize >= kb) {
        return fixed2((fileSize / kb).toString()) + "KB"
    } else {
        return fileSize + "B"
    }
    function fixed2(str){
        var result;
        var dianIndex = str.indexOf('.');
        if(dianIndex != -1){
            var zs = str.substr(0,dianIndex)
            var xs = str.substring(dianIndex,dianIndex+3)
            if(isnotdit){
                result = Math.ceil(zs + xs);
            }else{
                result = zs + xs;
            }


        }else{
            result = str;
        }

        return result;
    }

}
export const IsWx = function () {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

    return ua.match(/MicroMessenger/i) == "micromessenger";
}

export const fileMd5 = function(file,fn){

    //判断是否支持File对象
    if (typeof File == "undefined") {
        return;
    }

    var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunkSize = 1024 * 1024,
        chunks    = 0,
        currentChunk  = 0,
        blob          = (file instanceof Blob) ? file : file.file,
        spark         = new SparkMD5(),
        fileReader    = new FileReader();

    //异步函数
    fileReader.onload  = function (e) {
        // append array buffer
        if (e && e.target.result)
            spark.appendBinary(e.target.result);
        else if (fileReader.content)//extend FileReader >=IE10 依赖FileReader.prototype.readAsBinaryString
            spark.appendBinary(fileReader.content);
        else {
            //Error
        }

        currentChunk++;
        if (currentChunk < chunks) {
            loadNext();
        }
        else {
            loadEnd();
        }
    };
    fileReader.onerror = function () {

    };

    if (file.size > 2 * chunkSize) {//>2M的文件
        chunks = 3;
    }
    else {
        chunks = 1;
    }

    function loadNext() {
        if (3 == chunks) {
            var fstart = 0,
                fend   = chunkSize,
                lstart = file.size - chunkSize,
                lend   = file.size;

            if (0 == currentChunk)
                fileReader.readAsBinaryString(blobSlice.call(blob, fstart, fend));
            else if (1 == currentChunk)
                fileReader.readAsBinaryString(blobSlice.call(blob, lstart, lend));
            else if (2 == currentChunk) {
                //此时直接追加文件大小的文本 结束md5的计算
                spark.appendBinary(file.size.toString());
                loadEnd();
            }
        } else {
            fileReader.readAsBinaryString(blobSlice.call(blob, 0, file.size));
        }
    }

    function loadEnd() {
        var fileMd5 = spark.end();
        if (typeof fn != 'undefined') {
            fn(fileMd5);
        }
    }

    loadNext();

}


//------------------------------------------------- Extend ------------------------------------------------------------//
//extend FileReader support >= IE10
if (typeof FileReader != "undefined" && !FileReader.prototype.readAsBinaryString) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
        var binary = "";
        var pt     = this;

        var reader    = new FileReader();
        reader.onload = function (e) {
            var bytes  = new Uint8Array(e.target.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }

            //pt.result  - readonly so assign binary
            pt.content = binary;
            pt.onload()


        };
        reader.readAsArrayBuffer(fileData);
    }
}



/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}

/**
 * 判断客户端类型
 * @returns {boolean}
 * @constructor
 */
export const IsPC = function () {
    var userAgentInfo = navigator.userAgent.toLowerCase();
    var Agents        = ["android", "symbianos", "windows phone",
        "ipad", "ipod", "iphone", "android", "phone", "mobile",
        "wap", "netfront", "java", "opera mobi", "opera mini", "ucweb",
        "windows ce", "symbian", "series", "webos", "sony",
        "blackberry", "dopod", "nokia", "samsung", "palmsource", "xda",
        "pieplus", "meizu", "midp", "cldc", "motorola", "foma",
        "docomo", "up.browser", "up.link", "blazer", "helio", "hosin",
        "huawei", "novarra", "coolpad", "webos", "techfaith",
        "palmsource", "alcatel", "amoi", "ktouch", "nexian",
        "ericsson", "philips", "sagem", "wellcom", "bunjalloo", "maui",
        "smartphone", "iemobile", "spice", "bird", "zte-", "longcos",
        "pantech", "gionee", "portalmmm", "jig browser", "hiptop",
        "benq", "haier", "^lct", "320x320", "240x320", "176x220",
        "w3c ", "acs-", "alav", "alca", "amoi", "audi", "avan", "benq",
        "bird", "blac", "blaz", "brew", "cell", "cldc", "cmd-", "dang",
        "doco", "eric", "hipt", "inno", "ipaq", "java", "jigs", "kddi",
        "keji", "leno", "lg-c", "lg-d", "lg-g", "lge-", "maui", "maxo",
        "midp", "mits", "mmef", "mobi", "mot-", "moto", "mwbp", "nec-",
        "newt", "noki", "oper", "palm", "pana", "pant", "phil", "play",
        "port", "prox", "qwap", "sage", "sams", "sany", "sch-", "sec-",
        "send", "seri", "sgh-", "shar", "sie-", "siem", "smal", "smar",
        "sony", "sph-", "symb", "t-mo", "teli", "tim-", /*"tosh",*/ "tsm-",
        "upg1", "upsi", "vk-v", "voda", "wap-", "wapa", "wapi", "wapp",
        "wapr", "webc", "winw", "winw", "xda", "xda-", "Googlebot-Mobile"];
    var flag          = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 * 设置cookie
 * @param key
 * @param value
 * @param date有效期
 */
export const setCookie = function (key, value, date) {
    if (!date) {
        if (Bowser.msie) {
            VueCookies.set(key, value);
        } else {
            VueCookies.set(key, value, '0');
        }
    } else {
        VueCookies.set(key, value, date);
    }

}

/**
 * 获取cookie
 * @param key
 */
export const getCookie = function (key) {
    return VueCookies.get(key);

}

/**
 * 删除cookie
 * @param key
 */
export const removeCookie = function (key) {
    return VueCookies.remove(key);

}
/**
 *
 * @param url 插入script标签地址
 * @param callback
 */

export const innerScript  = function (url, callback) {
    var script  = document.createElement('script');
    script.src  = url;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    script.onload = script.onreadystatechange = function () {

        if (!script.readyState || /loaded|complete/.test(script.readyState)) {

            script.onload = script.onreadystatechange = null;

            if (callback)
                callback()
        }
    };
}

/**
 *
 * @param url css 引用路径
 */

export const innerLink = function (url) {
    var link  = document.createElement('link');
    link.href = url;
    link.rel  = "stylesheet";
    document.head.appendChild(link);
}

/**
 * 获取url相对路径
 * @returns {string}
 */
export const getUrlRelativePath = function () {
    var url    = document.location.toString();
    var arrUrl = url.split("//");

    var start  = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if (relUrl.indexOf("?") != -1) {
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

/**
 * 获得当月的最后一天
 * @returns {number}
 */

export const getCurrentMonthLast = function () {
    var date              = new Date();
    var currentMonth      = date.getMonth();
    var nextMonth         = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay            = 1000 * 60 * 60 * 24;
    return new Date(nextMonthFirstDay - oneDay).getDate();
}
export const rootPath            = function () {
    var strFullPath = window.document.location.href;
    var strPath     = window.document.location.pathname;
    var pos         = strFullPath.indexOf(strPath);
    var prePath     = strFullPath.substring(0, pos);
    return prePath;
}

function share_makeurl(name, data) {
    var templates = {
        qzone       : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{URL}}&title={{TITLE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}&pics={{IMAGE}}',
        qq          : 'http://connect.qq.com/widget/shareqq/index.html?url={{URL}}&title={{TITLE}}&source={{SOURCE}}&desc={{DESCRIPTION}}&summary={{SUMMARY}}&site={{SOURCE}}&pics={{IMAGE}}',
        tencent     : 'http://share.v.t.qq.com/index.php?c=share&a=index&title={{TITLE}}&url={{URL}}&pic={{IMAGE}}',
        weibo       : 'http://service.weibo.com/share/share.php?url={{URL}}&title={{TITLE}}&pic={{IMAGE}}&appkey={{WEIBOKEY}}',
        wechat      : '/wechat/share?url={{URL}}&title={{TITLE}}&summary={{SUMMARY}}&pics={{IMAGE}}',
        douban      : 'http://shuo.douban.com/!service/share?href={{URL}}&name={{TITLE}}&text={{DESCRIPTION}}&image={{IMAGE}}&starid=0&aid=0&style=11',
        diandian    : 'http://www.diandian.com/share?lo={{URL}}&ti={{TITLE}}&type=link',
        linkedin    : 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={{TITLE}}&url={{URL}}&summary={{SUMMARY}}&source={{SOURCE}}&armin=armin',
        facebook    : 'https://www.facebook.com/sharer/sharer.php?u={{URL}}&title={{TITLE}}&description={{DESCRIPTION}}&caption={{SUBHEAD}}&link={{URL}}&picture={{IMAGE}}',
        twitter     : 'https://twitter.com/intent/tweet?text={{TITLE}}&url={{URL}}&via={{SITE_URL}}',
        google      : 'https://plus.google.com/share?url={{URL}}'
    };
    if(data['summary'] == undefined){
        data['summary'] = data['description'];
    }
    return templates[name].replace(/\{\{(\w)(\w*)\}\}/g, function (m, fix, key) {
        var nameKey = name + fix + key.toLowerCase();
        key = (fix + key).toLowerCase();

        return encodeURIComponent((data[nameKey] === undefined ? data[key] : data[nameKey]) || '');
    });
}
function filterTitle(title) {
    return title.replace(/<.*?>/ig, '')

}

export const shareFn = function (el, opt) {
    opt.summary     = opt.summary ? filterTitle(opt.summary).replace(/&nbsp;/gi, '').substr(0, 79) : '';

    var reg_key_word = /公司+.*数据+.*/

    if(reg_key_word.test( opt.summary )){

        opt.summary = opt.summary.replace(/数据/gi,'**')
    }
    opt.title = opt.title.replace(/a/gi,'*')
    opt.description = opt.description.replace(/a/gi,'*') + '（分享自 @公开课）';
    var setdata     = {
        site_url: location.origin,
        source  : location.origin, // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://mooc.boolongo.com" />
        sites   : ['weibo', 'wechat', 'qq', 'qzone'], // 启用的站点
        // disabled: ['google', 'facebook', 'twitter'], // 禁用的站点
    };
    setdata         = _extendObj(setdata, opt)
    if (IsPC()) {
        //【1.0 PC】
        socialShare(el, setdata);
    } else {
        if (!opt.url) {
            setdata.url = location.href
        }
        var sharT = setdata.title;
        el = typeof el === 'string' ? document.querySelectorAll(el) : el;
        for(var i = 0; i < el.length; i++){
            if(el[i].getAttribute('data-id') == 'weibo'){
                setdata.title = setdata.description;
            }else{
                setdata.title = sharT;
            }
            if (el[i].getAttribute('data-id') == 'weibo' || el[i].getAttribute('data-id') == 'qzone') {
                var $url = share_makeurl(el[i].getAttribute('data-id'), setdata);
                el[i].setAttribute('href',$url)
            }
        }
    }




    //微信浏览器中，打开网页
    if (/MicroMessenger/i.test(navigator.userAgent)) {

        //签名
        sdkSign({
            data     : {'url': location.href},
            callback : function (res) {

                wx.config({
                    debug    : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId    : res.appId, // 必填，公众号的唯一标识
                    timestamp: res.timestamp, // 必填，生成签名的时间戳
                    nonceStr : res.nonceStr, // 必填，生成签名的随机串
                    signature: res.signature,// 必填，签名，见附录1
                    jsApiList: res.jsApiList
                });

                var shareData = {
                    title   : setdata.title,
                    desc    : setdata.summary,
                    link    : location.href,
                    imgUrl  : setdata.image,
                    trigger : function (res) {
                    },
                    complete: function (res) {
                    },
                    success : function (res) {
                    },
                    cancel  : function (res) {
                    },
                    fail    : function (res) {
                    }
                };

                //监听微信分享
                wx.ready(function () {
                    // 2. 分享接口
                    // 2.1 监听“分享到朋友圈”
                    wx.onMenuShareTimeline(shareData);

                    // 2.2 监听“分享给朋友”
                    wx.onMenuShareAppMessage(shareData);

                    // 2.3 监听“分享到QQ”
                    wx.onMenuShareQQ(shareData);

                    // 2.4 监听“分享到QQ空间”
                    wx.onMenuShareQZone(shareData);

                    // 2.4 监听“分享到微博”
                    wx.onMenuShareWeibo(shareData);
                });

            },
            errorback: function () {

            }
        });
    }


}