/**
 * Created by haner on 15/8/6.
 * 我要买详情页面操作
 */
(function(){
    var id = location.href.getQueryValue('id'),
        from = decodeURIComponent(location.href.getQueryValue('from')),
        backUrl = 'config.PGaugeResult' + '?id=' + id;//默认为关注资产的评估结果

    if(from) backUrl = from;

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = backUrl;
    });


    /**
     * 获取我要买详情
     */
    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    Ajax.queryRecord({
        url:config.IGetEntrust,
        data:{
            personalId:id,
            type:3
        }
    });

})();