/**
 * Created by haner on 15/8/6.
 */
(function(){
    var id = location.href.getQueryValue('id');

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = config.POtherGaugeResult + '?id=' + id;
    });

    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    /**
     * 获取评估结果详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:id}
    },function(res){
        $('input[name="taxesTotal"]').val(res.data.taxesTotal);
    });



    $('input[name="personalId"]').val(id);

    $('#bug').submit(function(e){
        e.preventDefault();
        var msg = '';
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }

        Ajax.submitForm({
            url:config.ISaveEntrust,
            data:$(this)
        },function(){
            Tools.toast('提交成功',function(){
                location.href = config.POtherGaugeResult + '?id=' + id;
            });
        });
    });


    /**
     * 表单验证
     */
    function validForm(){

        var loanPrice = $('input[name="h_entrustPrice"]'),
            _loanPrice = $('input[name="entrustPrice"]'),
            mobiletel = $('input[name="mobiletel"]');

        if(mobiletel.val().isEmpty() || !mobiletel.val().isPhone()){
            return '请输入正确的电话号码';
        }

        if(loanPrice.val().isNumber2()){
            return '请填写正确的交易金额';
        }

        _loanPrice.val(parseFloat(loanPrice.val())*10000);

    }
})();