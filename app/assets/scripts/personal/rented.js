/**
 * Created by haner on 15/8/4.
 */
(function(){
    var id = location.href.getQueryValue('id');
    /**
     * 获取出租详情
     */

    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    Ajax.queryRecord({
        url:config.IGetEntrustById,
        data:{
             id:id
        },
        renderEle:'#sale'
    });


    var swiper = undefined,
        body = $('body');
    body.on('click','.upload_img_area img',function(){
        $('.swiper-container').show();
        $('body').css('overflow','hidden');
        if(swiper){
            swiper.slideTo($(this).parent().index() + 1, 300, false);
            return;
        }
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
    });


    body.on('click','.swiper-wrapper',function(){
        body.css('overflow','');
        $('.swiper-container').fadeOut();
    });

})();