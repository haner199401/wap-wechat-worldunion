(function(){
    var myAsset = $('#my_asset'),//我的资产
        go_other_asset = $('#go_other_asset');

    if(!UserService.getToken()){
        myAsset.on('click',function(){
            location.href = config.PNoAsset;
        });
        go_other_asset.on('click',function(){
            location.href = config.PNoOtherAsset;
        });
        return;
    }

    myAsset.on('click',function(){
        location.href = config.PMyAsset;
    });
    go_other_asset.on('click',function(){
        location.href = config.POtherAsset;
    });

    Ajax.queryRecord({
        url:config.IMyInfo
    },function(res){
        UserService.saveUser(res.data);
        $('.money').text(Math.round(res.data.netAssetTotal/10000) || 0);
    });

})();