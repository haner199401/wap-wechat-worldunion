(function(){

    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyAssets,
            data: {
                userId: UserService.getUserId(),
                type: config.enum.assetType.careAsset
            },
            showlistkey: 'persionalList'
        },function(response){
            if(response&&response.data&&config.page == 1){
                if(!response.data.persionalList || !response.data.persionalList.length){
                    location.href = config.PNoOtherAsset;
                }
            }
        });
    };


    //关注资产数据获取
    config.pageRequest();

    //查看详情
    $('body').on('click','#wu-list li',function(){
        var total = parseInt($(this).find('.assetTotalPrice').text(),10),
            url = config.POtherGaugeResult;
        if(total<=0){
            url = config.POtherGaugeFail;
        }
        location.href = url + '?id=' + $(this).attr('data-id') + '&from=' + encodeURIComponent(location.href);
    });

})();