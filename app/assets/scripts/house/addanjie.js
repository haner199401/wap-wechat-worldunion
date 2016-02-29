(function () {


    var id = location.href.getQueryValue('id'),
        flag = location.href.getQueryValue('flag'),
        fromMyLoan = location.href.getQueryValue('from_loan'),
        from = decodeURIComponent(location.href.getQueryValue('from')),
        body = $('body'),
        backUrl = config.PGaugeResult + '?id=' + id;
        if(from) backUrl = from;
        if(flag) backUrl = config.PAnJieDetail + '?id=' + id;;

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = backUrl;
    });


    if (!id) {
        Tools.toast(config.tips.noauth);
        return;
    }


    /**
     * 获取按揭信息
     */
    Ajax.queryRecord({
        url: config.IGetAnJieDetail,
        data: {
            personalId: id
        },
        renderEle:'#anjie'
    }, function (res) {
        $('input[name="personalId"]').val(id);

        //有按揭信息
        if(res&&res.data){
            $('input[name="id"]').val(res.data.id);
            //是否有还款记录
            if(res.data.aheadRefund && res.data.aheadRefund.length){
                $('input[name="hasRecord"]').val('has');
            }
        }


        renderAfterTodo();

    });

    /**
     * 保存，修改按揭信息
     */
    $('#anjie').on('submit',function (e) {
        var flag = e._args;
        e.preventDefault();
        var msg = '';
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }
        var isUpdate = !!$('input[name="id"]').val(),
            hasRecord = !!$('input[name="hasRecord"]').val(),
            url = '';
        Ajax.submitForm({
            url: isUpdate ? config.IUpdateAnjie:config.ISaveAnjie ,
            data: $(this)
        },function(res){
            if(flag){
                //有还款记录
                if(hasRecord){
                     url = config.PGetRentuMoneyRecord + '?_=' + new Date().getTime();
                }else{
                     url = config.PAddRecord + '?from='+ encodeURIComponent(location.href);
                }

                location.href = url + '&pid=' + id +'&ajid=' + res.data.id;
            }else{
                //if(fromMyLoan){
                    location.href = config.PFinance + '?id=' + id;
                //}else{
                //    history.go(-1);
                //}

            }
        });

    });

    /**
     * 金额换算
     */
    body.on('change','input[name="h_loanPrice"]',function(){
        $('input[name="loanPrice"]').val($(this).val()*10000);
    });

    body.on('change','input[name="h_contractRatePre"]',function(){
        $('input[name="contractRatePre"]').val($(this).val()/100);
    });

    /**
     * 添加还款记录
     */
    body.on('click', '#go_return_money_record', function (e) {
        e.preventDefault();
        $('#anjie').trigger('submit','other_submit');
    });




})();


/**
 * 表单验证
 */
function validForm() {
    var load = $('input[name="h_loanPrice"]').val(),
        contractRatePre = $('input[name="h_contractRatePre"]').val(),
        loanAgeLimit = $('input[name="loanAgeLimit"]').val();

    if (load.isEmpty() || load.isNumber2()) {
        return '请输入正确的贷款金额！';
    }

    if (contractRatePre.isEmpty() || contractRatePre.isNumber2() || parseInt(contractRatePre) > 100) {
        return '请输入正确的合同利率标准！';
    }

    if (loanAgeLimit.isEmpty() || loanAgeLimit.isNumber2() || parseInt(contractRatePre) > 100) {
        return '请输入正确的贷款年限！';
    }

    return '';
}


/**
 * 渲染之后处理
 */
function renderAfterTodo(){

    var opt={};

    opt.date = {preset : 'date'}; //日期格式
    opt.datetime = {preset : 'datetime'}; //日期时间格式
    opt.time = {preset : 'time'};//时间格式

    opt.default = {
        headerText:'',//设置标题 格式
        showLabel:false, //显示 隐藏年月日 标题
        dateFormat:'yyyy-mm-dd',
        theme: 'android-ics light', //皮肤样式
        display: 'bottom', //显示方式
        mode: 'scroller', //日期选择模式
        maxDate:new Date(),//最大日期
        onSelect:undefined
    };
    var date_dom = $("#datepicker");
    date_dom.mobiscroll($.extend(opt['date'], opt['default']));
    date_dom.parent().on('click',function(){
        date_dom.mobiscroll('show');
    });

}
