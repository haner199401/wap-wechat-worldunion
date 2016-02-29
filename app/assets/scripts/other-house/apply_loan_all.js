/**
 * Created by haner on 15/8/9.
 */
(function(){
    var pid = location.href.getQueryValue('id'),
        body = $('body');

    //checkbox
    body.on('click','.checkbox i',function(){
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
        var inp = $('#' + $(this).attr('for'));
        if(inp.length){
            inp.val($(this).hasClass('active') ? $(this).attr('data-checked') : $(this).attr('data-nochecked'));
        }
    });



    /**
     * 获取评估结果详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:pid}
    },function(res){
        $('input[name="personalId"]').val(pid);
        try{
            $('input[name="other"]').val(Math.round(res.data.assessment.assetTotalPrice/10000));
            $('input[name="housePrice"]').val(res.data.assessment.assetTotalPrice);
        }catch(e){
            $('input[name="other"],input[name="housePrice"]').val(0);
        }

    });

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
        },function(res){
            Tools.toast('提交成功',function(){
                location.href = config.PLoan + '?id=' + pid + '&firstPrice=' + $('input[name="firstPrice"]').val();
            })
        });
    });


})();

/**
 * 表单验证
 */
function validForm(){
    var  loanPrice = $('input[name="h_oldPrice"]'),
        _loanPrice = $('input[name="oldPrice"]'),
        firstPrice = $('input[name="h_firstPrice"]'),
        _firstPrice = $('input[name="firstPrice"]'); //申请金额//原购买价


    if(firstPrice.val().isNumber2()){
        return '请填写正确的首付金额';
    }

    _firstPrice.val(parseFloat(firstPrice.val())*10000);

    if(loanPrice.val().isNumber2()){
        return '请填写正确的原购买价格';
    }

    _loanPrice.val(parseFloat(loanPrice.val())*10000);




}
