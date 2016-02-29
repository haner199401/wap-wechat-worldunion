(function(){

    Ajax.pageRequest({
            url:config.IMyInfo
        },function(res){
            
            UserService.saveUser(res.data);
            
            $('.username').text( res.data.fullName);
            $('.assets').text(  Math.round(res.data.assetTotal/10000) || 0 );
            $('.netassets').text( Math.round(res.data.netAssetTotal/10000) || 0);
            if(res.data.headUrl)
            {
                $('#imgPhoto').attr('src',res.data.headUrl);
            }
        }
    );

})();



$('[name="wdjedai"]').on('click',function(){
    location.href = "myJiedai.html";
});
$('[name="wdWeituo"]').on('click',function(){
    location.href = "myWeituo.html";
});
$('[name="suggestion"]').on('click',function(){
    location.href = "suggestion.html";
});

$('#submit_btn').on('click',function(e){
    e.preventDefault();
    UserService.removeUser();
    location.href = config.PLogin + '?from=' + encodeURIComponent(location.href);
});

