/**
 * Created by haner on 15/8/9.
 */
(function(){
    var id = location.href.getQueryValue('id');

        Ajax.queryRecord({
            url:config.IGetTaxesDetail,
            data:{personalId:id}
        },function(res){
            $('#taxesTotal').text(res.data.taxesTotal || 0);
            $('#pledgeValue').text(res.data.pledgeValue || 0);
        });

})();