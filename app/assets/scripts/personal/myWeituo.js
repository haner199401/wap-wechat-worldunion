

(function(){

    //分页列表
    config.pageRequest = function(){
        Ajax.pageRequest({
            url:config.IMyWeituo,
            data:{
                userId: UserService.getUserId()
            }
        });
    };
    config.pageRequest();

    $('body').on('click','#wu-list div.data_show',function(){
         var vtype=$(this).find('span.info').attr('data-id'),
             detailUrl = '';

        switch (vtype)
        {
            case "1":
                detailUrl = config.PMyRented;
                break;
            case "2":
                detailUrl = config.PMySaled;
                break;
            case "3":
                detailUrl = config.PMyBuged;
                break;
        }

        location.href = detailUrl + '?id=' + $(this).attr('data-id');
    });
})();