(function(){
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyAssets,
            data: {
                userId: UserService.getUserId(),
                type: config.enum.assetType.myAsset
            },
            showlistkey: 'persionalList'
        },function(response){
            if(response&&response.data&&config.page==1){
                if(!response.data.persionalList || !response.data.persionalList.length){
                    location.href = config.PNoAsset;
                    return;
                }
            }

            try{
                $('#asset_total').text(Math.round((response.data.assetTotal || 0)/10000));
            }catch(e){
                $('#asset_total').text('0');
            }
            try{
                $('#net_asset_total').text( Math.round((response.data.netAssetTotal || 0)/10000 ));
            }catch (e){
                $('#net_asset_total').text('0');
            }
        });
    };

    config.pageRequest();

    $('body').on('click','#wu-list li',function(){
        var total = parseInt($(this).find('.assetTotalPrice').text(),10),
            url = config.PGaugeResult;
        if(total<=0){
            url = config.PGaugeFail;
        }
        location.href = url + '?id=' + $(this).attr('data-id') + '&from=' + encodeURIComponent(location.href);
    });
})();