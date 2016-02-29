/**
 * Created by haner on 15/8/10.
 */
(function(){

    var _route = location.href,
        id = _route.getQueryValue('id'),
        from = decodeURIComponent(_route.getQueryValue('from')),
        body = $('body'),
        backUrl = config.PMyAsset;

    if (!id) {
        Tools.toast(config.tips.noauth);
        return;
    }

    if(from) backUrl = from;

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = backUrl;
    });

    /***
     * 删除资产
     */
    var option = {text: '确认删除该资产？'};
    $('.del_btn').tap(function () {
        option.yesCb = function () {
            Ajax.queryRecord({
                url: config.IDelAsset,
                data: {id: id}
            }, function () {location.href = backUrl;});
        };
        Tools.showConfrim(option);
    });

    /**
     * 获取评估结果详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:id}
    });


    body.on('click','#finace,#rent,#sale,#buy',function(){
        Tools.toast('评估未成功，请稍后再试...');
    });

})();