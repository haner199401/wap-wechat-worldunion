/**
 * 修改手机号
 */

var newTel = $('#newTel'),
    telyzm = $('#telyzm'),
    oldtel = $('#oldtel'),
    usrid = location.href.getQueryValue('id'),
    User = UserService.getUser();

    oldtel.val(User.mobiletel || '');
/**
 * 表单提交
 */
$('#submit_btn').on('click',function(){
    var msg;
    if (!!(msg = validForm())) {
        Tools.toast(msg);
        return;
    }
    Ajax.submitForm({
        url:config.IChangeUserMobile,
        data:
        {
            id:usrid,
            mobiletel:oldtel.val(),
            newMobiletel:newTel.val(),
            authCode:telyzm.val()
        }
    },function(res){
        if(res&&res.data)
            UserService.saveUser(res.data);
        Tools.toast('提交成功！',function(){
            history.go(-1);
        });
    });
});
/**
 * 表单验证
 */
function validForm(){

    if(oldtel.val().isEmpty()){
        return '旧手机号不能为空';
    }

    if(!oldtel.val().isPhone()){
        return '旧手机号格式不正确';
    }
    if(newTel.val().isEmpty()){
        return '新手机号不能为空';
    }

    if(!newTel.val().isPhone()){
        return '新手机号格式不正确';
    }

    if(telyzm.val().isEmpty()){
        return '验证码不能为空';
    }

    if(!telyzm.val().isPostCode()){
        return '验证码格式不正确';
    }
}
/**
 * 获取验证码
 */
$('#sendcode').on('click', getCode);

function getCode(e) {
    e.preventDefault();
    if (newTel.val().isEmpty() || !newTel.val().isPhone()) {
        Tools.toast('手机号有误！');
        return;
    }

    Ajax.submitForm({
        url: config.ISendMsg,
        data: {mobiletel: newTel.val(),type: config.enum.sendCodetType.forgetPwd}
    },function(){
        //成功时改编状态
        changeBtnState($('#sendcode'));
    });
}
/**
 * 倒计时
 */
function changeBtnState(obj) {
    //移除事件，避免重复发送短信
    obj.unbind('click');
    var second = 60, text = obj.val();
    var timer = setInterval(function () {
        obj.val(text + '(' + (second--) + ')');
        if (second <= 0) {
            obj.bind('click', getCode).val(text);
            clearInterval(timer);
        }
    }, 1000);
}
