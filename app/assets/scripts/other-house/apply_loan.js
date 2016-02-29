/**
 * Created by haner on 15/8/9.
 */
(function(){
    var pid = location.href.getQueryValue('id'),
        body = $('body');

    /**
     * 查看产权信息
     */
    body.on('click','#go_property_record',function(){
        location.href = config.PInputProperty + '?pid=' + pid + '&look=true' + '&from=' + encodeURIComponent(location.href);
    });


    /**
     * 获取评估结果详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:pid},
        renderEle:'#apply_loan'
    });

    /**
     * 保存我要贷款数据
     */

   body.on('click','#submit_btn',function(){
        var msg = '';
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }
       location.href = config.PLoan + '?id=' + pid + '&firstPrice=' + $('input[name="firstPrice"]').val();
    });


    /**
     * 表单验证
     */
    function validForm(){
        var loanPrice = $('input[name="h_firstPrice"]'),
            _loanPrice = $('input[name="firstPrice"]'); //申请金额

        if(loanPrice.val().isNumber2()){
            return '请填写正确的首付金额';
        }

        _loanPrice.val(parseFloat(loanPrice.val())*10000);
    }

})();