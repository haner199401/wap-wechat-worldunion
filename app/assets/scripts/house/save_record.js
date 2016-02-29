/**
 * Created by haner on 15/8/1.
 */
(function(){


    //id 为记录 id 并非资产 id
    var from = location.href.getQueryValue('from'),
        id = location.href.getQueryValue('id'),
        anjie_id = location.href.getQueryValue('ajid'),
        pid = location.href.getQueryValue('pid'),
         opt={};
        opt.date = {preset : 'date'}; //日期格式
        opt.default = {
            headerText:'',//设置标题 格式
            showLabel:false, //显示 隐藏年月日 标题
            dateFormat:'yyyy-mm',
            theme: 'android-ics light', //皮肤样式
            display: 'bottom', //显示方式
            mode: 'scroller', //日期选择模式
            //showNow: true, //是否显示今天
            //startYear: currYear - 50, //开始年份
            maxDate:new Date(),//最大日期
            onSelect:function(val,self){
                $('input[name="refundDate"]').val(new Date(val).getTime());
            }
        };


    if(!anjie_id){
        Tools.toast(config.tips.noauth);
        return;
    }

    $('input[name="mortgageInfoId"]').val(anjie_id);
    $('input[name="pid"]').val(pid);
    var body = $('body');



    if(id){
        /**
         * 查找还款记录
         */
        Ajax.queryRecord({
            url:config.IFindRefundRecord,
            data:{id:id},
            renderEle:'#repayment'
        },other);

    }else{
        other();
    }

    function other(){
        var date_dom = $("#datepicker");
        date_dom.mobiscroll($.extend(opt['date'], opt['default']));
        date_dom.parent().on('click',function(){
            date_dom.mobiscroll('show');
        });
    }


    /**
     * 记录保存
     */
    $('#repayment').submit(function(e){
        e.preventDefault();
        var msg = '';
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }

        var isUpdate = !!$('input[name="id"]').val();
        Ajax.submitForm({
            url: isUpdate ? config.IUpdateRefundRecord:config.IAddRefundRecord,
            data:$(this)
        },function(){
            location.href = config.PGetRentuMoneyRecord + '?pid=' +pid + '&ajid=' + anjie_id;
        });

    });

    /**
     * 金额换算
     */
    body.on('change','input[name="h_refundPrice"]',function(){
        $('input[name="refundPrice"]').val($(this).val()*10000);
    });

    /**
     * 返回还款计划列表
     */

    $('.icon_back').on('click',function(){
        var url = config.PGetRentuMoneyRecord + '?pid=' +pid + '&ajid=' + anjie_id;
        if(from){
            url = decodeURIComponent(from);
        }
        location.href = url;
    });



})();


/**
 * 表单验证
 */
function validForm() {
    var load = $('input[name="h_refundPrice"]').val();

    if (load.isEmpty() || load.isNumber2()) {
        return '请输入正确的贷款金额！';
    }

    return '';
}


