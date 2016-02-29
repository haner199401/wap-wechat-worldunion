var body = $('body');
/**
 * 默认定位
 * @param callback
 */
function getLocation(callback){
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
            city.currentCity = res.data.cityName;
            Storage.set(Storage.CITY,city);
        }
        if($.isFunction(callback))callback(cityName);
    });
}

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
        $('#personalInfoCity_page').on('click','#city-list li a',function(){
            var cityId = $(this).attr('data-id');
            UPpersonalInfo(cityId,$(this).text());
        });
    });
}
getCityList();

/**
 * 修改个人资料的城市
 */

function UPpersonalInfo(cityId,cityName)
{
    Ajax.queryRecord({
            url:config.IUpdateUserInfo,
            data:{
                cityId:cityId,
                cityName:cityName
            },
            type:'POST'
        },function(res){
            UserService.saveUser(res.data);
            var city = {};
            city.id = cityId;
            city.cityName = cityName;
            UserService.setCity(city);
            Tools.toast("修改成功!",function(){
                history.go(-1);
            });
        }
    );
}


var current_city;
!(current_city = Storage.get(Storage.CITY)) ? $('#loacation_btn').trigger('click') : (function(){
    $('.current_city').text(current_city.currentCity || '深圳市');})();

