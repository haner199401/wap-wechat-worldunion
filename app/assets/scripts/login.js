
var mobile = $('#mobile'),
    yzm = $('#yzm');
var from = location.href.getQueryValue('from');
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
        UserService.saveUser($.extend(UserService.getUser(),res.data));
        location.href =  from ? decodeURIComponent(from) :config.PIndex;
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
$('.btn_yzm').on('click', getCode);
function getCode(e) {
    e.preventDefault();
    if (mobile.val().isEmpty() || !mobile.val().isPhone()) {
        Tools.toast('手机号有误！');
        return;
    }
    changeBtnState($('.btn_yzm'));
    Ajax.custom({
        url: config.ISendMsg,
        data: {mobiletel: mobile.val(),type: config.enum.sendCodetType.login}
    });
}

/**
 * 倒计时
 */
function changeBtnState(obj) {
    //移除事件，避免重复发送短信
    obj.unbind('tap');
    var second = 60, text = obj.text();
    var timer = setInterval(function () {
        obj.text(text + '(' + (second--) + ')');
        if (second <= 0) {
            obj.bind('tap', getCode).text(text);
            clearInterval(timer);
        }
    }, 1000);
}
