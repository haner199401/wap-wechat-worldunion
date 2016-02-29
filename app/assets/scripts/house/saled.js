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
     * 获取出租出售详情
     */
    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    Ajax.queryRecord({
        url:config.IGetEntrust,
        data:{
            personalId:id,
            type:2
        },
        renderEle:'#sale'
    },function(res){
        // 设置特色
        setFeature(res.data.feature);
    });


    /**
     * 获取特色
     */
    function setFeature(feature){
        if(!feature || !feature.length){
            $('#h_feature').prev().remove();
            return;
        }
        var h_feature = [];
        var src_feature = feature.split(",");
        if(!src_feature.length){return;}

        Ajax.getDictionary({
            url:config.IDictionary,
            data:{
                flexValuekey:config.dictionary.Entrust_feature
            }
        },function(res){
            for(var i in src_feature){
                for(var j in res){
                    if(src_feature[i] === res[j].code){
                        h_feature.push(res[j].value)
                    }
                }
            }
            var html = '';
            for(var k in h_feature){
                html += ('<div class="input_group"><label>' +h_feature[k]+ '</label></div>');
            }
            $('#h_feature').html(html);
        });

    }


    var swiper = undefined,
        body = $('body');
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