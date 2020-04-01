import {baseUrl} from '@/config/env'
import {getCookie} from '@/config/utils';
var merge = require('webpack-merge')

export default{
    /**
     * 初始化Ueditor
     * @param opt
     * @constructor
     */
    Init      : function (opt) {
        var defaultopt = {
            serverUrl          : baseUrl + '/api/home/ueditor/operate?ACCESS-TOKEN=aba5e5f096a0c257305b4ad1ee30cedd',
            elementPathEnabled : false,
            enableContextMenu  : false,
            imagePopup         : false,
            imageScaleEnabled  : false,
            autoFloatEnabled   : false,
            insertorderedlist  : {
                //系统自带
                'decimal'    : '',
                'lower-alpha': '', // 'a,b,c...'
                'lower-roman': '', //'i,ii,iii...'
                'upper-alpha': '', //'A,B,C'
                'upper-roman': '' //'I,II,III...'
            },
            insertunorderedlist: {
                //自定的样式
                'circle': '', // '○ 小圆圈'
                'disc'  : '', // '● 小圆点'
                'square': '' //'■ 小方块'
            }
        };
        var setopt     = merge(defaultopt, opt);

        this.el = setopt.el;
        UE.delEditor(setopt.el);
        UE.getEditor(setopt.el, setopt);

    },
    getOpt    : function (elname, attrname) {
        return UE.getEditor(elname).getOpt(attrname);
    },
    getContent: function (elname) {
        return UE.getEditor(elname).getContent()

    },
    setContent: function (elname, content) {
        UE.getEditor(elname).ready(function () {
            UE.getEditor(elname).setContent(content);
        })


    },
    hasContent: function (elname) {
        return UE.getEditor(elname).hasContents();

    }
}

