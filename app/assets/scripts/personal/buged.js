/**
 * Created by haner on 15/8/6.
 * 我要买详情页面操作
 */
(function(){
    var id = location.href.getQueryValue('id');

    /**
     * 获取我要买详情
     */
    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    Ajax.queryRecord({
        url:config.IGetEntrustById,
        data:{
            id:id
        }
    });

})();