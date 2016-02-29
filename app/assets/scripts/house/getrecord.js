/**
 * Created by haner on 15/8/1.
 */
(function(){
    /**
     * param
     */
    var pid = location.href.getQueryValue('pid'),
        anjie_id = location.href.getQueryValue('ajid'),
        body = $('body'),
        from = decodeURIComponent(location.href.getQueryValue('from')),
        backUrl = config.PAddAnJie + '?id=' + pid;

    if(from) backUrl = from;

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = backUrl + '&flag=true';
    });

    if(!pid){
        Tools.toast(config.tips.noauth);
        return;
    }

    /**
     * 获取还款记录列表
     */
    config.getRecordList = function(){
        Ajax.custom({
            url: config.IGetAnJieDetail,
            data: {
                personalId: pid
            },
            renderFor:'wu-list-tmpl',
            renderEle:'#wu-list',
            showlistkey:'aheadRefund'
        });
    };

    config.getRecordList();


    /**
     * 删除还款记录
     */
    var option = {text: '确认删除该记录？'};
    body.on('click', 'button.del_btn', function () {
        var assetid = $(this).parent().attr('data-id');
        option.yesCb = function () {
            Ajax.queryRecord({
                url: config.IDelRefundRecord,
                data: {id: assetid}
            }, function () {
                config.getRecordList();
            });
        };
        Tools.showConfrim(option);
    });

    /**
     * 编辑还款记录
     */
    body.on('click','button.edit_btn',function(){
        var assetid = $(this).parent().attr('data-id'),
        url = config.PAddRecord+ '?id='+assetid+'&pid=' + pid + '&ajid=' + anjie_id;
        location.href = url + '&from=' + encodeURIComponent(location.href);
    });

    /**
     * 去添加还款记录
     */
    $('#go_add').on('click', function () {
        var url = config.PAddRecord+ '?pid=' + pid + '&ajid=' + anjie_id;
        location.href = url + '&from=' + encodeURIComponent(location.href);
    });


})();
