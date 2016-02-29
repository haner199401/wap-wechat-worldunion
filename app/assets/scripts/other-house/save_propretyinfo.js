/**
 * Created by haner on 15/8/9.
 */
(function(){
    var pid = location.href.getQueryValue('pid'),
        look = location.href.getQueryValue('look'),
        body = $('body');

    if(!pid){
        Tools.toast(config.tips.noauth);
        return;
    }


    //checkbox
    body.on('click','.checkbox i',function(){
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
        var inp = $('#' + $(this).attr('for'));
        if(inp.length){
            inp.val($(this).hasClass('active') ? $(this).attr('data-checked') : $(this).attr('data-nochecked'));
        }
    });

    $('input[name="personalId"]').val(pid);

    /**
     * 获取评估结果详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:pid}
    },function(res){
        //设置房屋总价
        $('input[name="housePrice"]').val(res.data.assessment.assetTotalPrice || 0);
    });

    /**
     * 获取产权信息
     */
        if(look){
            Ajax.queryRecord({
                url:config.IGetPropretyInfo,
                data:{personalId:pid},
                renderEle:'#apply_loan_all'
            },function(res){
                $('input[name="personalId"]').val(pid);
                $('input[name="id"]').val(res.data.id);
                Ajax.queryRecord({
                    url:config.IGaugeResult,
                    data:{id:pid}
                },function(res){
                    //设置房屋总价
                    $('input[name="housePrice"]').val(res.data.assessment.assetTotalPrice || 0);
                });
            });
        }



    /**
     * 保存修改产权信息
     */
    $('#apply_loan_all').submit(function(e){
        e.preventDefault();
        var msg = '';
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }

        Ajax.submitForm({
            url:config.ISaveOrUpdatePropretyInfo,
            data:$(this)
        },function(){
            Tools.toast('提交成功',function(){
                location.href = config.POtherGaugeResult + '?id=' + pid;
            })
        });
    });


})();

/**
 * 表单验证
 */
function validForm(){
    var  loanPrice = $('input[name="h_oldPrice"]'),
        _loanPrice = $('input[name="oldPrice"]'); //申请金额

    if(loanPrice.val().isNumber2()){
        return '请填写正确的价格';
    }

    _loanPrice.val(parseFloat(loanPrice.val())*10000);

}
