/**
 * Created by haner on 15/7/17.
 */
(function(){
    var type = location.href.getQueryValue('type'),
        param = location.href.getQueryValue('p'),
        from = location.href.getQueryValue('from'),
        form = $('#suggest');

    if (!type || !param) {
        Tools.toast(config.tips.noauth);
        return;
    }

    var types = {xq: {text: '小区', type: 3,index:2}, ld: {text: '楼栋', type: 2,index:1}, fh: {text: '房号', type: 1,index:0}};
    var suggest = $('form textarea');
    suggest.attr('placeholder', suggest.attr('placeholder').replace('{}', types[type].text || types.xq.text));
    form.show();

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        if(from){
            location.href = decodeURIComponent(from);
        }else{
            history.go(-1);
        }
    });



    /**
     * 意见反馈
     */
    form.submit(function (e) {
        e.preventDefault();

        var vsuggest = $("[name='content']");

        if (vsuggest.val() == "") {
            Tools.toast('请填写您的意见！');
            return;
        }

        Ajax.submitForm({
            url: config.ISaveFeedBack,
            data: {
                type: types[type].type,
                title: param,
                content: vsuggest.val()
            }
        }, function (res) {
            Tools.toast(res.desc || '反馈成功',function(){
                if(from){
                    location.href = decodeURIComponent(from);
                }else{
                    history.go(-1);
                }
            });
        });
    });

})();
