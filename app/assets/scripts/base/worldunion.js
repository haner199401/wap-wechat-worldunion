(function() {

	template.openTag = "<!--[";
	template.closeTag = "]-->";

    new FastClick(document.body);

	// 模板帮助方法，绝对化图片地址
	template.helper('$absImg', function(content) {
		return content;
	});

	// 模板帮助方法，转换时间戳成字符串
	template.helper('$formatDate', function(content, type, defaultValue) {
		if (content) {
			return Tools.formatDate(content, type);
		} else {
			return defaultValue || '';
		}
	});

	// 模板帮助方法，验证是否已登录
	template.helper('$isLogin', function() {
		return !!config.getId();
	});

	// 模板帮助方法，转换房源你的标签
	template.helper('$convertTag', function(content) {
		if (content) {
			var result = '';
			var arr = content.split(',');
			for (var i in arr) {
				if (/^\s*$/.test(arr[i])) {
					continue;
				}
				result += '<span>' + arr[i] + '</span>';
			}
			return result;
		} else {
			return '--';
		}
	});

	//模板帮助方法，编码url参数
	template.helper('$encodeUrl', function(content) {
		return encodeURIComponent(content);
	});

	//模板帮助方法，格式化货币
	template.helper('$formatCurrency', function(content, defaultValue, unit) {
		if (!content) {
			return defaultValue || '--';
		}

		var mod = content.toString().length % 3;
		var sup = '';
		if (mod == 1) {
			sup = '00';
		} else if (mod == 2) {
			sup = '0';
		}

		content = sup + content;
		content = content.replace(/(\d{3})/g, '$1,');
		content = content.substring(0, content.length - 1);
		if (sup.length > 0) {
			content = content.replace(sup, '');
		}

		return content + unit || '';
	});

    //模板帮助方法，格式化货币
    template.helper('$formatMoney', function(money,isRound) {
        if (!money) {
            return '';
        }
        if(isRound){
            return (Math.round((parseFloat(money,10) || 0))) || '';
        }
        return (Math.round((parseFloat(money,10) || 0) / 10000)) || '';
    });

    template.helper('$formatPercent', function(money) {
        return ((parseFloat(money,10) || 0) * 100) || '';
    });

    //模板帮助方法，同比计算
    template.helper('$calcYoy', function(arg1,arg2) {
        try{
        return arg2 > 0 ? (Math.round((arg1-arg2)/arg2*100) || 0) : 0;
        }catch (e){
            return '';
        }
    });
    //模板帮助方法，同比计算
    template.helper('$absCalcYoy', function(arg1,arg2) {
        try{
            return arg2 > 0 ? (Math.abs(Math.round((arg1-arg2)/arg2*100)).toFixed(2)) : 0;
        }catch (e){
            return '';
        }
    });

    //模板帮助方法，格式化货币
    template.helper('$calcMoney', function(money,type) {
        if (!money) {
            return '';
        }
        var result = new Number(money/10000);
        if(type == 1){
            return result.toFixed(1);
        }
        return money;
    });

	//模板帮助方法，\r\n替换换行
	template.helper('$convertRN', function(content) {
		if (!content) {
			return '--';
		}
		return content.replace(/\r\n/gi, '<br/>');
	});

	//模板帮助方法，根据序列值添加样式名
	template.helper('$addClassByIdx', function(i, v, className) {
		if (i == v) {
			return className || '';
		}
	});

	//模板帮助方法，度量房源标题长度
	template.helper('$lengthHouseTitle', function(content) {
		var screenWidth = screen.width;
		var size = 10;
		if (screenWidth < 320) {
			size = 12;
		} else if (screenWidth < 480) {
			size = 20;
		} else if (screenWidth < 960) {

		}

		return content.substring(0, size) + '...';
	});

    //模板帮助方法，数字省略位数
    template.helper('$number2Fixed', function(num,digit,def) {
        //数字转换异常
        try{
            return (num ? new Number(num).toFixed(digit || 1) : (def || 0));
        }catch (e){
            return def || 0;
        }
    });

    //模板帮助方法，数字省略位数
    template.helper('$number2Fixed2', function(num,digit,def) {
        //数字转换异常
        if(!num){return ''}
        num +='';
        try{
            return num.substr(num.indexOf('.') + 1).length > 2 ? parseFloat(num,10).toFixed(digit || 1) : num;
        }catch (e){
            return def || 0;
        }
    });



    var body = $('body');

    //标题设置
    $('header .title').text($('title').text()).show();



    // 下一页按钮
    body.on('click', '.wlist_next', function(e) {
        e.preventDefault();

        if ($(this).hasClass('wu_loading')) {
            // 正在加载，不可点击
            return;
        }

        if (typeof config.pageRequest == 'function') {
            config.pageRequest();
        }
    });

    /**
     * 登陆页过滤
     */
    if($('.auth_page').length){
        if(!UserService.getToken()){
            $('#login_form,#dialog_bg').show();
        }
    }
    /**
     * 简单跳转
     */
    $('.just_href').on('click',function(){
        location.href = $(this).attr('data-href');
    });

    //列表 对勾 单选
    body.on('click','.data_list a',function(e){
        //$(this).siblings().removeClass('active');
        $('.data_list a').removeClass('active');
        $(this).addClass('active');
        $('#'+$(this).parent().attr('data-v-for')).val($(this).attr('data-id'));
        $('#'+$(this).parent().attr('data-t-for')).val($(this).text());
    });

    //select
    body.on('change','.select select',function(){
        $('#'+ $(this).attr('data-t-for')).val($(this).val());
        $('#'+ $(this).attr('data-v-for')).val($(this).val());
    });

    /**
     * 个人中心 跳转
     */

    $('.icon_personal').on('click',function(){
        location.href = config.PMyCenter;
    });


    /**
     * zepto fn
     */
    $.fn.isNumber_ = function(){
        return this.each(function(){
            this.onkeypress = function(e){
                return ((e.keyCode>=48&&e.keyCode<=57) || e.keyCode==46);
            }
        });
    };

    $.fn.isNumber = function(){
        return this.each(function(){
            log(this);
            this.onkeypress = function(e){
                return (e.keyCode>=48&&e.keyCode<=57);
            }
        });
    };

    $.fn.isIDCard = function(){
        return this.each(function(){
            this.onkeypress = function(e){
                return ((e.keyCode>=48&&e.keyCode<=57) || e.keyCode==120 || e.keyCode==88);
            }
        });
    };

})();

$(document).ready(function(){


    var mobile = $('#mobile'),
        yzm = $('#yzm');
    /**
     * 表单提交
     */
    $('#login_form').submit(function(e){
        e.preventDefault();
        var msg;
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }
        Ajax.submitForm({
            url:config.ILogin,
            data:$('#login_form')
        },function(res){
            config.signaParam.token = res.data.token || '';
            Storage.set(Storage.AUTH,config.signaParam);
            Storage.set(Storage.ACCOUNT, res.data || {});

            if(res.data.cityId){
                var city = {id:res.data.cityId,cityName:res.data.cityName};
                Storage.set(Storage.CITY, city);
            }

            var from = location.href.getQueryValue('from');
            if(from){
                location.href = decodeURIComponent(from);return;
            }

            if(location.href.indexOf('/login.html')!=-1){ //登录页面 则跳转至首页
                location.href = config.PIndex;return;
            }

            if($('.refresh_page').length){
                location.replace(location.href);return;
            }

            $('#login_form,#dialog_bg').hide();

            if($.isFunction(config.trigger)){
                config.trigger();
            }

        });
    });

    /**
     * 表单验证
     */
    function validForm(){
        if(mobile.val().isEmpty()){
            return '手机号不能为空';
        }

        if(!mobile.val().isPhone()){
            return '手机号格式不正确';
        }

        if(yzm.val().isEmpty()){
            return '验证码不能为空';
        }

        if(!yzm.val().isPostCode()){
            return '验证码格式不正确';
        }
    }

    /**
     * 获取验证码
     */
    $('#getcode').on('click', getCode);
    function getCode(e) {
        e.preventDefault();
        if (mobile.val().isEmpty() || !mobile.val().isPhone()) {
            Tools.toast('手机号有误！');return;
        }
        Ajax.custom({
            url: config.ISendMsg,
            data: {mobiletel: mobile.val(),type: config.enum.sendCodetType.login}
        },function(){
            changeBtnState($('.btn_yzm'));
        });
    }

    /**
     * 倒计时
     */
    function changeBtnState(obj) {
        //移除事件，避免重复发送短信
        obj.unbind('click');
        var second = 60, text = obj.text();
        var timer = setInterval(function () {
            obj.text(text + '(' + (second--) + ')');
            if (second <= 0) {
                obj.bind('click', getCode).text(text);
                clearInterval(timer);
            }
        }, 1000);
    }


    /**
     * close from layer
     */
    if($('.closeable_from').length){
        $('#dialog_bg').click(function(){
            $(this).hide();
            $('#login_form').hide();
        });
    }

    /**
     * go index layer
     */
    if($('.go_index_layer').length){
        $('#dialog_bg').click(function(){
           location.href = config.PIndex;
        });
    }


    $('[data-rule="number_"]').isNumber_();
    $('[data-rule="number"]').isNumber();
    $('[data-rule="idcard"]').isIDCard();
});

window.onload = function(){
    $('[data-rule="number_"]').isNumber_();
    $('[data-rule="number"]').isNumber();
    $('[data-rule="idcard"]').isIDCard();
};