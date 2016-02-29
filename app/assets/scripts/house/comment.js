/**
 * Created by haner on 15/7/29.
 */
(function(){
    var assessmentId = location.href.getQueryValue('assessmentId'),
        caseId = location.href.getQueryValue('caseId');

    if(!caseId || !assessmentId){
        Tools.toast(config.tips.noauth);
        return;
    }

    $('#suggest').on('submit',function(e){
        e.preventDefault();

        if(!this.opinion.value || this.opinion.value.isEmpty()){
            Tools.toast('请填写您的意见！');
            return;
        }
        var data = Tools.formJson($('#suggest'));
        data.caseId = caseId;
        data.assessmentId = assessmentId;
        Ajax.submitForm({
            url:config.IComment,
            data:data
        },function(){
            Tools.toast('提交成功！',function(){
                history.go(-1);
            });
        });

    });
})();