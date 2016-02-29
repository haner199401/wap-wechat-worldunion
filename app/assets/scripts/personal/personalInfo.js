/**
 * 获取房号
 */
var body = $('body');

(function(){

    Ajax.pageRequest({
        url:config.IMyInfo
    },function(res){
        UserService.saveUser(res.data);
        $('.username').text( res.data.fullName);
        $('.useridentity').text( res.data.identityCard);
        $('.usertel').text( res.data.mobiletel);
        $('.useraddress').text( res.data.cityName);
        $('[name="id"]').val( res.data.id);
        if(res.data.headUrl)
        {
            $('#imgPhoto').attr('src',res.data.headUrl);
        }
    });
})();


$('.usertel').on('click',function(){
    location.href = 'personalInfoTel.html?id=' +$('[name="id"]').val()+ '&from='+ encodeURIComponent(location.href);

});

/**
 * 修改个人资料的头像资料
 */
function UPpersonalInfo(path,call)
{
    Ajax.pageRequest({
            url:config.IUpdateUserInfo,
            data:{
                headUrl:path
            }
        },function(res){
            UserService.saveUser(res.data);
            call();
        }
    );

}

body.on('change','#photoFile', function () {
    if(!$(this).val().acceptFileType()){
        $(this).replaceWith('<input type="file" name="photoFile" id="photoFile">');
        Tools.toast(config.tips.fileTypeError);return;
    }
    var imgs = $('#imgPhoto');
    $.ajaxFileUpload({
        url:config.IFileServer,
        secureuri: false,
        fileElementId: 'photoFile',
        data: {
            pathName: 'photo'
        },
        success: function (data, status) {
            var res = undefined;
            try{
                res = JSON.parse($(data).find('pre').text());
            }catch (e){
                log('过大或者服务器异常！');
                Tools.toast('上传失败！');return;
            }
            if(res.code != '0'){
                log('过大或者服务器异常！');
                Tools.toast(res.desc || '上传失败！');return;
            }
            imgs.attr('src',res.data);
            UPpersonalInfo(res.data,function(){
                Tools.toast('上传成功!');
            });

        },
        error: function (data, status, e) {
            Tools.toast('上传失败!');
        }
    });

    $(this).replaceWith('<input type="file" name="photoFile" id="photoFile">');
});




