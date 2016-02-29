/**
 * 意见反馈
 */
(function(){


    $('#submit_btn').on('click',function(){

        var vsuggest=$("[name='yj']");

        if(vsuggest.val()==""){
            Tools.toast('请填写您的意见！');
            return;
        }
        Ajax.submitForm({
            url:config.ISaveFeedBack,
            data:
            {
                content: vsuggest.val(),
                type:4
            }
        },function(res){
            Tools.toast(res.desc || '提交成功！',function(){
                location.href = config.PMyCenter;
            });
        });

    });
})();