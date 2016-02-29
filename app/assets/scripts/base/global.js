//Log Tools
var log = function (msg) {
    if (typeof console != 'undefined') {
        console.log(msg);
    }
};

//Dialog Type
var DialogType = {
    confirm: 'confirm',
    tip: 'tip'
};

/**
 * calc font-size
 */
(function (doc, win) {

    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        maxDevicewidth = 480, //最大设备宽度
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) {
                log('documentElement.clientWidth is undefined!');
                return;
            }
            if (clientWidth >= maxDevicewidth) {
                clientWidth = maxDevicewidth;
            }
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };
    //方便计算
    win.px2rem = function (px) {
        return px / 20 / 2;
    };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


// Ajax Tools
var Ajax = (function(){

    /**
     * Ajax Global Setting
     */
    $.ajaxSettings.timeout = 7000;
    $.ajaxSettings.crossDomain = true;
    var requestPool = [];
    return {
        /**
         * 基于ajax的查询
         *
         * @param data
         *            封装请求url，请求数据，请求类型
         * @param callback
         *            ajax请求成功后执行的回调方法
         * @param callbackDone
         *            ajax请求成功后最后执行的方法
         */

        pageRequest: function (data, callback, callbackDone) {
            var renderFor = data.renderFor || 'wu-list-tmpl', renderEle = data.renderEle || '#wu-list',
                clear = data.clear || 'true',
                pageParam = {pageSize:config.pageSize,page:config.page};

            var next = $('.wlist_next'), nextStr = '<a class="wlist_next">更多</a>';
            if (next.length == 0) {
                $(renderEle).after(nextStr);
                next = $('.wlist_next');
            }
            if(config.page === 1 && clear === 'true'){
                $(renderEle).html('');
            }
            next.show().addClass('wu_loading').text(config.tips.loading);

            data.data = $.extend(pageParam,data.data);

            requestPool.push('first requrse');

            $.ajax({
                url: data.url,
                data:{
                    jsonData:JSON.stringify(data.data)
                },
                type: data.type || 'GET',
                dataType:'json',
                cache:false,
                beforeSend:showLoadingLayer,
                headers:setHeader(data.data)
            }).then(function (response, textStatus, jqXHR) {

                requestPool.shift();
                if(requestPool.length>0)return;

                next.removeClass('wu_loading');
                if(!response || !response.code || response.code !== '0'){
                    if(!response) {Tools.toast(config.tips.server);return;}
                    if(!UserService.getToken()){
                        next.text('登录后获取...');
                        return;
                    }
                    next.text(config.tips.server);
                    if(!response){Tools.toast(config.tips.server);return;}
                    Tools.toast(response.desc || config.tips.server);return;
                }
                var renderData = response.data[data.showlistkey] || response.data || [];

                log('Response： \n');
                log(renderData);

                if ($('#' + renderFor).length) {
                    var result = template.render(renderFor, {
                        'list': renderData
                    });
                    $(renderEle).append(result);
                }

                if(renderData.length == 0){
                    //数据没有结果显示无数据提示
                    if(config.page == 0){
                        next.html(config.tips.nodata);
                    }else{
                        next.html(config.tips.nomoredata);
                    }
                }else{
                    if(renderData.length < config.pageSize){
                        next.text(config.tips.nomoredata);
                        next.addClass('wu_loading');
                    }else{
                        config.page += 1;
                        next.text('更多');
                    }
                }

                if ($.isFunction(callback)) {
                    callback(response);
                }

            }).done(function (xhr, b) {
                if ($.isFunction(callbackDone)) {
                    callbackDone();
                }
                bindValid();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                log('[pageRequest] ' + textStatus + ':' + data.url);
                next.removeClass('wu_loading');
                if (textStatus === 'timeout') {
                    next.text(config.tips.timeout);
                } else {
                    next.text(config.tips.server);
                }
            }).always(function(res){
                hideLoadingLayer();
            });

        },
        /**
         * 基于ajax的查询
         *
         * @param data
         *            封装请求url，请求数据，请求类型
         * @param callback
         *            ajax请求成功后执行的回调方法
         * @param callbackDone
         *            ajax请求成功后最后执行的方法
         */
        queryRecord: function (data, callback, callbackDone, callbackError) {
            var renderFor = data.renderFor || 'wu-detail-tmpl', renderEle = data.renderEle || '#wu-detail';

            $.ajax({
                url: data.url,
                data:{
                    jsonData:JSON.stringify(data.data)
                },
                type: data.type || 'GET',
                dataType:'json',
                cache: false,
                beforeSend:showLoadingLayer,
                headers:setHeader(data.data)
            }).then(function (response) {
                if(!response || !response.code || response.code !== '0'){
                    if(!response) {Tools.toast(config.tips.server);return;}
                    Tools.toast(response.desc || config.tips.server);
                }

                if ($('#' + renderFor).length ) {
                    var result = template.render(renderFor, response.data || {});
                    $(renderEle).html(result);
                }
                if ($.isFunction(callback)) {
                    callback(response);
                }

            }).done(function () {
                if ($.isFunction(callbackDone)) {
                    callbackDone();
                }
                bindValid();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                log('[queryRecord] ' + textStatus + ':' + data.url);
                if (textStatus === 'timeout') {
                    Tools.toast(config.tips.timeout);
                } else {
                    Tools.toast(config.tips.server);
                }
                if ($.isFunction(callbackError)) {
                    callbackError();
                }
            }).always(function(){
                hideLoadingLayer();
            });
        },
        /**
         * 基于ajax的表单提交
         *
         * @param data
         *            传入的参数
         * @param callback
         *            ajax请求成功后执行的回调方法
         * @param callbackDone
         *            ajax请求成功后最后执行的方法
         */
        submitForm: function (data, callback, callbackDone,callbackError) {
            var formData;

            var isForm = !!data.data.length;
            if (isForm) {
                formData = Tools.formJson(data.data);
                data.data.find('input[type="submit"],#submit_btn').attr('disabled', true);
            } else {
                formData = data.data;
            }

            if(UserService.getUserId()){
                formData.userId = UserService.getUserId();
            }

            $.ajax({
                url: data.url,
                data: {
                    jsonData:JSON.stringify(formData)
                },
                type: data.type || 'POST',
                dataType:'json',
                beforeSend:showLoadingLayer,
                headers:setHeader(formData)
            }).then(function (response) {
                if (isForm) {
                    data.data.find('input[type="submit"],#submit_btn').removeAttr('disabled');
                }
                // 服务器无响应
                if(!response || !response.code){
                    Tools.toast(config.tips.server);return;
                }
                // 0 成功保存 其他则为失败，（重复提交时 状态码需要和005 区分开）
                if(response.code !== '0'){
                    Tools.toast(response.desc || config.tips.server);return;
                }

                if ($.isFunction(callback)) {
                    callback(response);
                }
            }).done(function () {
                if (isForm) {
                    data.data.find('input[type="submit"],#submit_btn').removeAttr('disabled');
                }
                if ($.isFunction(callbackDone)) {
                    callbackDone();
                }
                bindValid();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                log('[submitForm] ' + textStatus + ':' + data.url);
                if (isForm) {
                    data.data.find('input[type="submit"],#submit_btn').removeAttr('disabled');
                }
                if (textStatus === 'timeout') {
                    Tools.toast(config.tips.timeout);
                } else {
                    Tools.toast(config.tips.server);
                }
                if ($.isFunction(callbackError)) {
                    callbackError();
                }
            }).always(function(){
                log('always.....');
                if (isForm) {
                    data.data.find('input[type="submit"],#submit_btn').removeAttr('disabled');
                }
                hideLoadingLayer();
            });
        },
        /**
         * 自定义查询
         *
         * @param data-封装请求url，请求数据，请求类型
         * @param callback-请求成功后执行的回调方法
         * @param callbackError-请求失败后执行的回调方法
         */
        custom: function (data, callback, callbackError) {
            var renderFor = data.renderFor, renderEle = data.renderEle;

            $.ajax({
                url: data.url,
                data: {
                 jsonData:JSON.stringify(data.data)
                },
                type: data.type || 'GET',
                dataType:'json',
                beforeSend:showLoadingLayer,
                headers:setHeader(data.data)
            }).then(function (response, textStatus, jqXHR) {

                // error filter
                if(!response || !response.code || (response.code !== '0' && response.code !== '001') ){
                    if(!response) {Tools.toast(config.tips.server);return;}
                    Tools.toast(response.desc || config.tips.server);
                }

                //data render
                if ($('#' + renderFor).length) {
                    var renderData = response.data[data.showlistkey] || response.data || [];
                    log('Response \n\r' + JSON.stringify(renderData));

                    var result = template.render(renderFor, {
                        'list': renderData || []
                    });
                    $(renderEle).html(result);
                }

                //callback
                if (typeof callback == 'function') {
                    callback(response);
                }

            }).fail(function (jqXHR, textStatus, errorThrown) {
                log('[custom] ' + textStatus + ':' + data.url);
                if (textStatus === 'timeout') {
                    Tools.toast(config.tips.timeout);
                } else {
                    Tools.toast(config.tips.server);
                }
                if ($.isFunction(callbackError)) {
                    callbackError();
                }
            }).always(function(){
                hideLoadingLayer();
                bindValid();
            });
        },
        /**
         * 获取系统字典数据
         * @param data
         * @param callback
         * @param callbackError
         */
        getDictionary: function (data, callback, callbackError) {
            var renderFor = data.renderFor, renderEle = data.renderEle;

            $.ajax({
                url: data.url,
                data: {
                    jsonData:JSON.stringify(data.data)
                },
                type:'GET',
                dataType:'json',
                beforeSend:showLoadingLayer
            }).then(function (response, textStatus, jqXHR) {
                bindValid();

                if(!response || !response.code || response.code !== '0'){
                    Tools.toast(response.desc || config.tips.server);
                }

                if ($('#' + renderFor).length) {
                    try{
                        var result = template.render(renderFor, {'list': response.data[0].values || []});
                        $(renderEle).html(result);
                    }catch (e){
                        Tools.toast(response.desc || config.tips.server);
                    }

                }

                if (typeof callback == 'function') {
                    callback(response.data[0].values);
                }


            }).fail(function (jqXHR, textStatus, errorThrown) {
                log('[getDictionary] ' + textStatus + ':' + data.url);
                if (textStatus === 'timeout') {
                    Tools.toast(config.tips.timeout);
                } else {
                    Tools.toast(config.tips.server);
                }
                if ($.isFunction(callbackError)) {
                    callbackError();
                }
            }).always(function(){
                hideLoadingLayer();
            });
        }
    };


    /**
     * 字典排序
     * @param args
     * @returns {string}
     */
    function sort(args) {
        var keys = Object.keys(args);
        keys = keys.sort();
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key] = args[key];
        });

        var string = '';
        for (var k in newArgs) {
            if(typeof newArgs[k] === 'object'){
                newArgs[k] = JSON.stringify(newArgs[k]);
            }
            string += k + newArgs[k];
        }
        return string;
    }

    /**
     * 设置头信息
     * @param p
     */
    function setHeader(p){
        var auth  = Storage.get(Storage.AUTH) || {};
        var temp = Storage.get(Storage.AUTH) || {};
        var data = sort($.extend(auth,p));
        return $.extend(temp,{sign:$.md5(data)});
    }

    // load layer id
    config.loadLayerId = 'WU.LOAD.KEY';

    /**
     * 处理授权页面，登录框
     * 显示load 层
     */
    function showLoadingLayer(xhr){
        //if($('#login_form,#dialog_bg').css('display') === 'block'){
        //    return false;
        //}
    }

    /**
     * hide
     */
    function hideLoadingLayer(){
        // find load layer
        // hide
    }

    function bindValid(){
        $('[data-rule="number_"]').isNumber_();
        $('[data-rule="number"]').isNumber();
        $('[data-rule="idcard"]').isIDCard();
    }

})();

//Tools
var Tools = (function () {
    var preventDefault, panel, delay, toastPanel, options = {
        btnsText: ['取消', '确认'],
        text: '',
        yesCb: undefined,
        noCb: undefined,
        type: DialogType.confirm
    };

    return {
        //格式化时间
        formatDate: function (content, type) {
            var pattern = "yyyy-MM-dd hh:mm";
            // 2012年1月23日
            // 18:00
            // 2013.1.23
            // 2013/01/23
            switch (type) {
                case 1:
                    pattern = "yyyy年M月d日";
                    break;
                case 2:
                    pattern = "hh:mm";
                    break;
                case 3:
                    pattern = "yyyy.M.d";
                    break;
                case 4:
                    pattern = "yyyy-MM-dd hh:mm:ss";
                    break;
                case 5:
                    pattern = "yyyy年MM月";
                    break;
                case 6:
                    pattern = "yyyy-MM-dd";
                    break;
                default:
                    pattern = !!type ? type : pattern;
                    break;
            }
            if (isNaN(content) || content == null) {
                return content;
            } else if (typeof (content) == 'object') {
                var y = dd.getFullYear(), m = dd.getMonth() + 1, d = dd
                    .getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                var yearMonthDay = y + "-" + m + "-" + d;
                var parts = yearMonthDay.match(/(\d+)/g);
                var date = new Date(parts[0], parts[1] - 1, parts[2]);
                return date.format(pattern);
            } else {
                var date = new Date(parseInt(content));
                return date.format(pattern);
            }
        },

        // 获取窗口尺寸，包括滚动条
        getWindow: function () {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },

        // 获取文档尺寸，不包括滚动条但是高度是文档的高度
        getDocument: function () {
            var doc = document.documentElement || document.body;
            return {
                width: doc.clientWidth,
                height: doc.clientHeight
            };
        },

        // 获取屏幕尺寸
        getScreen: function () {
            return {
                width: screen.width,
                height: screen.height
            };
        },

        // 显示、禁用滚动条
        showOrHideScrollBar: function (isShow) {
            preventDefault = preventDefault || function (e) {
                    e.preventDefault();
                };
            (document.documentElement || document.body).style.overflow = isShow ? 'auto' : 'hidden';
            // 手机浏览器中滚动条禁用取消默认touchmove事件
            if (isShow) {
                // 注意这里remove的事件必须和add的是同一个
                document.removeEventListener('touchmove', preventDefault, false);
            } else {
                document.addEventListener('touchmove', preventDefault, false);
            }
        },
        // form 转换为键值对 对象
        formJson: function (form) {
            var o = {};
            if (typeof form !== 'object') return o;

            var a = form.serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        //双按钮 对话框
        showConfrim: function (option) {
            if (!option) {
                option = {};
            }
            option.type = DialogType.confirm;
            this.showPanel(option);
        },
        showTip: function (option) {
            var o = {};
            if(typeof option === 'object'){
                o = option;
            }
            if(typeof option === 'string'){
                o.text = option;
            }
            o.type = DialogType.tip;
            this.showPanel(o);
        },
        // 提示框
        showPanel: function (option) {
            options = $.extend(options, option);
            panel = panel || $('#dialog');
            var type = options.type,
                text = options.text;

            config.onYesClick = options.yesCb;
            config.onNoClick = options.noCb;

            panel.find('p').html(text);
            var btnOpt = panel.find('.options');

            if (type === DialogType.tip) {
                btnOpt.html('<div style="width: 100%;" class="btn btn_ok">' + (options.btnsText[0] || '' ) + '</div>');
            } else {
                btnOpt.html('<div class="btn btn_no fl">' + options.btnsText[0] + '</div>' +
                    '<div class="btn btn_ok fr">' + options.btnsText[1] + '</div>');
            }

            panel.show();
            $('#dialog_bg').show();

            btnOpt.find('.btn_ok').on('click', function () {
                if (typeof config.onYesClick === 'function') {
                    config.onYesClick();
                    $('#dialog,#dialog_bg').hide();
                    config.onYesClick = undefined;
                }
            });

            btnOpt.find('.btn_no').on('click', function () {
                if (typeof config.onNoClick === 'function' && type !== DialogType.tip) {
                    $('#dialog,#dialog_bg').hide();
                    config.onNoClick();
                    config.onNoClick = undefined;
                }else{
                    panel.hide();
                    $('#dialog_bg').hide();
                }
            });


        },

        // toast
        toast: function (msg, callback,tick) {
            toastPanel = toastPanel || $('#wu-toast');
            tick = tick || 1000;

            if (delay) {
                clearTimeout(delay);
            }

            toastPanel.find('span').text(msg);
            toastPanel.fadeIn();
            delay = setTimeout(function () {
                toastPanel.fadeOut();
                if($.isFunction(callback)) callback();
            }, tick);
        },
        //获取 微信 UA
        isMicorMessage:function(){
            var UA = navigator.userAgent,
                res = {};
            res[/android/.test(UA)? 'isAndroid' :(/iphone/.test(UA) ?'isIphone':'')] = true;
            return res;
        }
    };
})();

// 本地存储
var Storage = (function() {
    return {
        AUTH : 'WORLDUNION_AUTH',
        ACCOUNT : 'WORLDUNION_ACCOUNT',
        REMEMBER : 'WORLDUNION_REMEMBER',
        OPENID : 'WORLDUNION_OPENID',
        CITY:'WORLDUNION_CITY',
        get : function(key, isSession) {
            if (!Storage.isLocalStorage()) {
                return;
            }
            var value = Storage.getStorage(isSession).getItem(key);
            if(value){
                return JSON.parse(value);
            }else{
                return undefined;
            }
        },
        set : function(key, value, isSession) {
            if (!Storage.isLocalStorage()) {
                return;
            }
            value = JSON.stringify(value);
            Storage.getStorage(isSession).setItem(key, value);
        },
        remove : function(key, isSession) {
            if (!Storage.isLocalStorage()) {
                return;
            }
            Storage.getStorage(isSession).removeItem(key);
        },
        getStorage: function(isSession){
            return isSession ? sessionStorage : localStorage;
        },
        isLocalStorage : function() {
            try {
                if (!window.localStorage) {
                    log('不支持本地存储');
                    return false;
                }
                localStorage.setItem('isLocalStorage', 'abc');
                localStorage.removeItem('isLocalStorage');
                return true;
            } catch (e) {
                log('本地存储已关闭');
                return false;
            }
        }
    };
})();

//User service
var UserService = {
    getUser:function(){
        return Storage.get(Storage.ACCOUNT) || {};
    },
    getUserId:function(){
        return this.getUser().id || '';
    },
    getToken:function(){
        try{
            return Storage.get(Storage.AUTH).token || Storage.get(Storage.ACCOUNT).token
        }catch (e){
            log(e);
            return undefined
        }
    },
    removeUser:function(){
        Storage.remove(Storage.AUTH);
        Storage.remove(Storage.ACCOUNT);
        Storage.remove(Storage.CITY);
    },
    saveUser:function(user){
        Storage.set(Storage.ACCOUNT, $.extend(this.getUser(),user || {}));
    },
    setCity:function(city){
        var s = Storage.get(Storage.CITY) || {};
        Storage.set(Storage.CITY, $.extend(s,city));
    }
};

// 扩展Date的format方法
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};


String.prototype.isSpaces = function () {
    for (var i = 0; i < this.length; i += 1) {
        var ch = this.charAt(i);
        if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
            return false;
        }
    }
    return true;
};

String.prototype.isValidMail = function () {
    return (new RegExp(
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
        .test(this));
};

//手机号
String.prototype.isPhone = function () {
    return (new RegExp(/^1\d{10}?$/).test(this));
};

//判空
String.prototype.isEmpty = function () {
    return (/^\s*$/.test(this));
};

//密码
String.prototype.isValidPwd = function () {
    return (new RegExp(/^([_]|[a-zA-Z0-9]){8,16}$/).test(this));
};

//验证码
String.prototype.isPostCode = function () {
    return (new RegExp(/^\d{6}?$/).test(this));
};

//键值对
String.prototype.getQueryValue = function (key) {
    var q = this, keyValuePairs = [];

    if (q.length > 1) {
        var idx = q.indexOf('?');
        q = q.substring(idx + 1, q.length);
    } else {
        q = null;
    }

    if (q) {
        for (var i = 0; i < q.split("&").length; i++) {
            keyValuePairs[i] = q.split("&")[i];
        }
    }

    for (var j = 0; j < keyValuePairs.length; j++) {
        if (keyValuePairs[j].split("=")[0] == key) {
            // 这里需要解码，url传递中文时location.href获取的是编码后的值
            // 但FireFox下的url编码有问题
            return decodeURI(keyValuePairs[j].split("=")[1]);

        }
    }
    return '';
};





//trim
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '')
};

//正数
String.prototype.isNumber = function () {
    return !(/^[1-9]\d*(\.\d+)?$/.test(this));
};

//整数
String.prototype.isNumber2 = function(){
    return !(/^[1-9]\d*(\d+)?$/.test(this));
};

//大于零
String.prototype.isNumber3 = function () {
    return !(/^[0-9]\d*(\.\d+)?$/.test(this));
};

//2位小数
String.prototype.isNumber4 = function () {
    return !(/^[1-9]\d*(\.\d{0,2})?$/.test(this));
};

//身份证验证
String.prototype.isIDCard = function(){
    return (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this));
};

//imgae type
String.prototype.acceptFileType = function(){
    return (/(\.|\/)(jpe?g|png)$/i.test(this));
};


