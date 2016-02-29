(function(){


    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyJiedai,
            data: {
                userId: UserService.getUserId()
            }
        });
    };
    config.pageRequest();

    $('body').on('click','#wu-list div.data_show',function(){

        var vtype=$(this).attr('data-type');

        switch (vtype)
        {
            case "1":
                location.href = config.PMyFinanceDetail    + '?financeId=' + $(this).attr('data-id')+ '&from='+ encodeURIComponent(location.href);
                break;
            case "2":
                location.href = config.PMyPLoanDetail    + '?financeId=' + $(this).attr('data-id')+ '&from='+ encodeURIComponent(location.href);
                break;
        }
    });


})();
