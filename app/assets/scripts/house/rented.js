/**
 * Created by haner on 15/8/4.
 */
(function(){
    var id = location.href.getQueryValue('id'),
        from = decodeURIComponent(location.href.getQueryValue('from')),
        backUrl = config.PGaugeResult + '?id=' + id;



    if(from) backUrl = from;

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = backUrl;
    });

    /**
     * 获取出租详情
     */

    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    var swiper = undefined,
        body = $('body');

    Ajax.queryRecord({
        url:config.IGetEntrust,
        data:{
            personalId:id,
            type:1
        },
        renderEle:'#sale'
    },function(){

    });


    body.on('click','.upload_img_area img',function(){
        $('.swiper-container').show();
        $('body').css('overflow','hidden');

        var imgs = $('.upload_img_area img'),
            imgHtml = '<div class="swiper-slide">' +
                '<img data-src="{src}" class="swiper-lazy">' +
                '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
                '</div>',
            img = [];
        $.each(imgs,function(i,o){
            img.push(imgHtml.replace('{src}',o.src))
        });
        $('.swiper-wrapper').html(img.join(''));
        swiper = new Swiper('.swiper-container', {preloadImages: false,lazyLoading: true,loop : true});
        if(swiper){
            swiper.slideTo($(this).parent().index() + 1, 300, false);
        }
    });


    body.on('click','.swiper-wrapper',function(){
        body.css('overflow','');
        $('.swiper-container').fadeOut();
    });

})();