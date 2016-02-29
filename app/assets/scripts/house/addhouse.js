Mobilebone.captureLink = true;

var body = $('body');

var current_city;
!(current_city = Storage.get(Storage.CITY)) ? getLocation() : (function(){
        $('input[name="cityId"]').val(current_city.id || '');
        $('.icon_address').text(current_city.cityName || '');})();

/**
 * 返回处理
 */
var backUrl = config.PMyAsset;
if(!UserService.getUserId()){
    backUrl = config.PIndex;
}

body.on('click','#add_house .icon_back',function(e){
    e.preventDefault();
    location.href = backUrl;
});


/**
 * 默认定位
 * @param callback
 */
function getLocation(callback){

    var bg = $('#dialog_bg');
    bg.html('<i class="loading"></i>');
    bg.show();

    var myGeo = new BMap.Geocoder();
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            log('浏览器定位成功');

            myGeo.getLocation(r.point, function (rs) {
                var city = rs.addressComponents.city;
                log('[定位]结果：' + city);
                searchCity(city,callback);
            });
        } else {
            Tools.toast(config.tips.locationerror);
            log('浏览器定位失败,CODE:' + this.getStatus());
        }

        bg.html('');
        bg.hide();
    });
}


/**
 * compare city
 */
function searchCity(cityName,callback){
    Ajax.custom({
        url:config.ICompareCity,
        data:{
            cityName:cityName
        },
        type:'POST'
    },function(res){
        if(res.data.initiateMode == '1'){
            //匹配到系统城市处理！
            var city = {};
            city.id = res.data.id;
            city.cityName = res.data.cityName;
            UserService.setCity(city);
            $('input[name="cityId"]').val(city.id || '');
            $('.icon_address').text(city.cityName || '');
        }
            if($.isFunction(callback))callback(cityName);
    });
}


//checkbox
body.on('click','.checkbox i',function(){
    $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
    var inp = $('#' + $(this).attr('for'));
    if(inp.length){
        inp.val($(this).hasClass('active') ? $(this).attr('data-checked') : $(this).attr('data-nochecked'));
    }
});


/**
 * 手动定位
 */
body.on('click','#loacation_btn',function(){
    var self = $(this);
    var text = self.text();
    self.text('定位中...');
    getLocation(function(city){
        //没有匹配到城市处理！！！！！

        $('.current_city').text(city);
        self.text(text);
    });
});


/**
 * 获取城市列表，设置定位城市
 */
function getCityList(){
    //获取城市
    Ajax.custom({
        url:config.ICityList,
        renderFor:'city-list-tmpl',
        renderEle:'#city-list'
    },function(){
        $('#loaction_page').on('click','#city-list li a',function(){
            $('.icon_address').text($(this).text());
            var city = $('input[name="cityId"]');
            if(city.val() != $(this).attr('data-id')){
                city.val($(this).attr('data-id'));
                $('#h_xq,#xq,#h_ld,#ld,#h_fh,#fh').val('');
            }
        })
    });
}


/**
 * 楼栋，小区，房号页面回调
 */
function initPageData(pagein){

    config.page = 1;

    var loadMore = $('.wlist_next');
    if (loadMore.length !== 0) {
        loadMore.remove();
    }

    /**
     * 找不到小区，楼栋，房号
     */
    canNotFindData(pagein.id);

    //赋值请求函数
    switch (pagein.id){
        case 'choose_xq':
            getProjectList('choose_xq');
            break;
        case 'choose_ld':
            getBuildList('choose_ld');
            break;
        case 'choose_fh':
            getRoomNumberList('choose_fh');
            break;
    }



    //发起请求
    if($.isFunction(config.pageRequest)){
        config.pageRequest();
    }

    /**
     * 搜索
     */
    var searchDom = $('.search_form input[type="text"]'),
        searchBtn = $('.search_form input[type="button"]');
    searchDom.unbind('keyup');
    searchDom.bind('keyup',function(){
        if($.isFunction(config.pageRequest)){
            config.page = 1;
            config.pageRequest();
        }
    });

    searchBtn.unbind('click');
    searchBtn.bind('click',function(){
        if($.isFunction(config.pageRequest)){
            config.page = 1;
            config.pageRequest();
        }
    });




}


/**
 * 获取小区列表
 */
function getProjectList(pageid){

    if(!$('input[name="cityId"]').val()){
        Tools.toast('请选择城市！');
        $('#'+pageid).find('.icon_back').attr('href','locationCity.html');
        return;
    }

    config.pageRequest = function(){
        Ajax.pageRequest({
            url:config.IProjectList,
            data:{
                cityId:$('input[name="cityId"]').val(),
                projectName:encodeURIComponent($('#choose_xq input[name="key"]').val())
            },
            renderFor:'project_list_tmpl',
            renderEle:'#project_list'
        },function(){
            $('#project_list a').on('click',function(){
                //重新选择时
                if($(this).attr('data-id') !== $('#h_xq').val()){
                    $('#h_ld,#ld,#h_fh,#fh').val('');
                }
                $('#h_xq').val($(this).attr('data-id'));
                $('#xq').val($(this).text());
            });
        });
    };

}


/**
 * 获取楼栋
 */
function getBuildList(pageid){

    if(!$('#h_xq').val()){
        Tools.toast('请选择楼盘！');
        $('#'+pageid).find('.icon_back').attr('href','choose_xq.html');
        return;
    }

    config.pageRequest = function(){
        Ajax.pageRequest({
            url:config.IBuildList,
            data:{
                cityId:$('input[name="cityId"]').val(),
                projectId:$('#h_xq').val(),
                buildName:encodeURIComponent($('#choose_ld input[name="key"]').val())
            },
            renderFor:'build_list_tmpl',
            renderEle:'#build_list'
        },function(){
            $('#build_list a').on('click',function(){
                //重新选择时
                if($(this).attr('data-id') !== $('#h_ld').val()){
                    $('#h_fh,#fh').val('');
                }
                $('#h_ld').val($(this).attr('data-id'));
                $('#ld').val($(this).text());
            });
        });
    };
}


/**
 * 获取房号
 */
function getRoomNumberList(pageid){

    if(!$('#h_ld').val()){
        Tools.toast('请选择楼栋！');
        $('#'+pageid).find('.icon_back').attr('href','choose_ld.html');
        return;
    }

    config.pageRequest = function(){
        Ajax.pageRequest({
            url:config.IRoomNumber,
            data:{
                cityId:$('input[name="cityId"]').val(),
                buildId:$('#h_ld').val(),
                roomCode:encodeURIComponent($('#choose_fh input[name="key"]').val())
            },
            renderFor:'room_list_tmpl',
            renderEle:'#room_list'
        },function(){
            $('#room_list a').on('click',function(){
                $('#h_fh').val($(this).attr('data-id'));
                $('#fh').val($(this).text());
                $('input[name="area"]').val($(this).attr('data-area'));
            });
        });
    };

}


/**
 * 获取装修列表
 */
function getPageData(){
    Ajax.getDictionary({
        url:config.IDictionary,
        data:{
            flexValuekey:config.dictionary.Entrust_decoration
        },
        renderFor:'zx_list_tmpl',
        renderEle:'#zx_list'
    },function(){
        $('#zx_list a').on('click',function(){
            $('#zx').val($(this).text());
            $('#h_zx').val($(this).attr('data-id'));
        });
    });
}


/**
 * 表单验证
 * @returns {boolean}
 */
function validForm() {
    var mj = $('#mj').val();

    if(!$('input[name="cityId"]').val()){
        Tools.toast('请选择城市！');
        return true;
    }

    if(!$('#h_xq').val()){
        Tools.toast('请选择楼盘！');
        return true;
    }

    if(!$('#h_ld').val()){
        Tools.toast('请选择楼栋！');
        return true;
    }

    if(!$('#h_fh').val()){
        Tools.toast('请选择房号！');
        return true;
    }

    if (mj.isNumber4() || mj.length > 7) {
        Tools.toast('请输入有效面积！');
        return true;
    }

    if(!$('[name="necessarySet"]').val()){
        Tools.toast('请选择装修情况！');
        return true;
    }
}


/**
 * 表单提交
 */
$('#submit_btn').on('click',function(e){
    e.preventDefault();
    submitForm();
});

config.trigger = function(){
    submitForm();
};

function submitForm(){
    if(validForm()){return;}
    if(!UserService.getUserId()){
        $('#login_form,#dialog_bg').show();
        return;
    }
    Ajax.submitForm({
        url:config.IAddMyAsset,
        data:$('#addhouse')
    },function(res){
        /**
         * 保存数据之后 保存城市
         * 若重新手动选择过则更新至用户信息！！！！！！asynchronous！
         */
        var comfirmCityId = $('input[name="cityId"]').val();
        if(Storage.get(Storage.CITY)&&Storage.get(Storage.CITY).cityId != comfirmCityId){
            //更新城市之后再处理
            UpdatePersonalCity(comfirmCityId,function(){
                successAfter(res);
            });
        }else{
            successAfter(res);
        }
    });
}

/**
 * 修改个人资料的城市
 */

function UpdatePersonalCity(cityId,cb){
    Ajax.queryRecord({
            url:config.IUpdateUserInfo,
            data:{cityId:cityId},
            type:'POST'
        },function(res){
            UserService.saveUser(res.data);
            var city = {};
            city.id = res.data.cityId;
            city.cityName = res.data.cityName;
            UserService.setCity(city);
            if($.isFunction(cb))cb();
        }
    );
}

/**
 * save success after
 */
function successAfter(res){
    if(!res.data.assetTotalPrice){
        location.href = config.PGaugeFail + '?id=' +res.data.id;
        return;
    }
    location.href =  ($('input[name="type"]').val() === '1' ? config.PGaugeResult : config.POtherGaugeResult) + '?id=' +res.data.id;
}


/**
 * 找不到小区
 */
function canNotFindData(pagein){
    //赋值请求函数
    var selector = ['[name="cityId"]','[name="projectId"]','[name="buildId"]','[name="roomId"]'],
        param = [];
    switch (pagein.id){
        case 'choose_xq':
            selector.splice(1);
            break;
        case 'choose_ld':
            selector.splice(2);
            break;
        case 'choose_fh':
            selector.splice(3);
            break;
    }

    $(selector.join(',')).each(function(i,o){
        if(o.value)
            param.push(o.value);
    });

    $('#'+pagein).find('.not_found').click(function(){
        location.href = 'nodata.html'+$(this).attr('data-type') + '&p=' + param.join(',');
    });
}
