define(function () {

    // 判断类型
    function getType(obj, type) {
        return Object.prototype.toString.call(obj).match(/\[object ([a-zA-Z]*)\]/)[1] === type;
    }    

    //事件监听/解除事件工具类
    var EventUtil = {
        
        addHandler: (function() {
            if(window.addEventListener) {
                return function() {
                    arguments[0].addEventListener(arguments[1, arguments[2], false]);
                };
            } else if(window.attachEvent) {
                return function() {
                    arguments[0].attachEvent("on" + arguments[1], arguments[2]);
                };
            } else {
                return function() {
                    arguments[0]["on" + arguments[1]] = arguments[2];
                };
            }
        })(),    

        removerHandler: (function() {
            if(window.removeEventListener) {
                return function() {
                    arguments[0].removeEventListener(arguments[1], arguments[2]);
                };
            } else if(window.detachEvent) {
                return function() {
                    arguments[0].detachEvent("on" + arguments[1], arguments[2]);
                };
            } else {
                return function() {
                    return function() {
                        arguments[0]["on" + arguments[1]] = null;
                    };
                }
            }
        })()
    };  
    

    // 相关认证的正则表达式
    var verificatRet = {
        // 手机号
        mobile: /^((1[3|4|5|7|8][0-9]{1})+\d{8})$/,
        // 电子邮箱
        email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
        // 数字
        number: /^[0-9]*$/,
        //密码 密码由英文大小写数字自称且超过6个字符小于10个字符
        password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/,
        // 非零正整数
        NZ_number: /^\+?[1-9][0-9]*$/,
        // 非零负整数
        _NZ_number: /^\-[1-9][0-9]*$/,
        // 非负整数（正整数 + 0）
        _noIntNumber: /^\d+$/,
        // 非正整数（负整数 + 0）
        noIntNumber: /^((-\d+)|(0+))$/,
        // 整数
        intNumber: /^-?\d+$/,
        // 正浮点小数
        doubleNumber: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
        // 非正浮点小数（负浮点小数 + 0）
        _noDoubleNum: /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/,
        // 负浮点小数
        _doubleNumber: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
    }       
    // 验证正则表达式
    var verificat = {
        /** 非空验证 */
        isNotNull: function(source){
            if(source != null && source != undefined && source != 'undefined' && source != "")
                return true;
            return false;
        },  
        /**去空格后非空验证*/
        isNotNullTrim: function(source){
            if(source != null && source != undefined && source != 'undefined' && $.trim(source) != "")
                return true;
            return false;
        },
        /** 手机号验证 */
        mobileVer: function(mobile){
            if(mobile != null && mobile != "" && verificatRet.mobile.test(mobile)){
                return true;
            }
            return false;
        },
        /** 邮箱验证 */
        emailVer: function(email){
            if(email != null && email != "" && verificatRet.email.test(email)){
                return true;
            }
            return false;
        },
        /** 密码验证 */
        passwordVer: function(password){
            if(password != null && password != "" && verificatRet.password.test(password)){
                return true;
            }
            return false;
        },
        /** 验证是否为正整数 */
        numberVer: function(num) {
            if(num != "") {
                return verificatRet.number.test(num);
            } else {
                return false;
            }
        },
        /** 验证非零正整数 */
        NZ_numberVer: function(num) {
            if(num != "") {
                return verificatRet.NZ_number.test(num);
            } else {
                return false;
            }
        },
        /** 验证非零负整数 */
        _NZ_numberVer: function(num) {
            if(num != "") {
                return verificatRet._NZ_number.test(num);
            } else {
                return false;
            }
        },
        /** 验证非负整数（正整数 + 0） */
        _noIntNumberVer: function(num) {
            if(num != "") {
                return verificatRet._noIntNumber.test(num);
            } else {
                return false;
            }
        },
        /** 验证非正整数（负整数 + 0） */
        noIntNumberVer: function(num) {
            if(num != "") {
                return verificatRet.noIntNumber.test(num);
            } else {
                return false;
            }
        },
        /** 验证整数 */
        intNumberVer: function(num) {
            if(num != "") {
                return verificatRet.intNumber.test(num);
            } else {
                return false;
            }
        },
        /** 验证正浮点小数 */
        doubleNumberVer: function(num) {
            if(num != "") {
                return verificatRet.doubleNumber.test(num);
            } else {
                return false;
            }
        },
        /** 验证非正浮点小数（负浮点小数 + 0） */
        _noDoubleNumVer: function(num) {
            if(num != "") {
                return verificatRet._noDoubleNum.test(num);
            } else {
                return false;
            }
        },
        /** 验证负浮点小数 */
        _doubleNumberVer: function(num) {
            if(num != "") {
                return verificatRet._doubleNumber.test(num);
            } else {
                return false;
            }
        },
    }    

    // 格式化时间
    function formatTime(time, cFormat){
        if(arguments.length === 0) return null;
        if((time + '').length === 10) {
            time = +time * 1000;
        };    

        var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}', 
            date;
        if(typeof time === 'object') {
            date = time;
        } else {
            date = new Date(time);
        }    

        var formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        };    

        var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            var value = formatObj[key];
            if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                if (result.length > 0 && value < 10) {
                    value = '0' + value;
                }
                return value || 0;
            })
        return time_str;
    }

    return {
        getType: getType,
        EventUtil: EventUtil,
        verificat: verificat,
        formatTime: formatTime
    }
});