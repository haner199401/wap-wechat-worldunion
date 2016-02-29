/**
 * Created by haner on 15/8/3.
 */
Mobilebone.captureLink = true;
var body = $('body');

(function(){

    var id = location.href.getQueryValue('id').replace('#',''),
        body = $('body'),
        swiper = undefined;

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = config.PGaugeResult + '?id=' + id;
    });

    /**
     * 获取房产详情
     * @type {*|jQuery|HTMLElement}
     */
    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:id},
        renderEle:'#sale'
    },function(){
        $('input[name="personalId"]').val(id);
        setFeature();
    });



    //特色类型
    body.on('click','.checkbox i', function () {
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
        var arr = [];
        $('.checkbox i.active').each(function () {
            arr.push($(this).attr('data-val'));
        });
        $('input[name="feature"]').val(arr.join(','));
    });


    /**
     * 图片上传
     */
    body.on('change','#fileToUpload', function () {
        var imgs = $('.upload_img');
        if(!$(this).val().acceptFileType()){
            $('#fileToUpload').replaceWith('<input type="file" name="photoFile" id="fileToUpload">');
            Tools.toast(config.tips.fileTypeError);
            return;
        }
        if(imgs.children().length > 5){
            Tools.toast('最多上传5张！');
            return;
        }
        $.ajaxFileUpload({
            url: config.IFileServer,
            secureuri: false,
            fileElementId: 'fileToUpload',
            data: {
                pathName: 'house'
            },
            success: function (data, status) {
                var res = undefined;
                try{
                    res = JSON.parse($(data).find('pre').text());
                }catch (e){
                    log('过大或者服务器异常！');
                    Tools.toast('上传失败！');return;
                }
                if(res.code != '0'){
                    log('过大或者服务器异常！');
                    Tools.toast(res.desc || '上传失败！');return;
                }

                var html = '<li><img src="' + res.data +'" width="100%" height="100%"/></li>';
                imgs.prepend($(html));


                var imgArr = [];
                imgs.find('img').each(function(i,o){
                    var o = {};
                    o.idx = i + '';
                    o.imgAddress = $(this).attr('src');
                    imgArr.push(o);
                });

                if(swiper){
                    var imgHtml = '<div class="swiper-slide">' +
                        '<img data-src="{src}" class="swiper-lazy">' +
                        '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
                        '</div>';
                    swiper.prependSlide(imgHtml.replace('{src}',res.data));
                    swiper.update();
                }


            },
            error: function (data, status, e) {
                Tools.toast('上传失败!');
            }
        });
        // 文件 change 事件仅触发一次的bug
        $('#fileToUpload').replaceWith('<input type="file" name="photoFile" id="fileToUpload">');
    });


    /**
     * 表单提交
     */
    body.on('click','#submit_btn',function(e){
        e.preventDefault();

        var msg = '';
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }
        var data = Tools.formJson($('#sale'));
        setImgData(data);
        Ajax.submitForm({
            url:config.ISaveEntrust,
            data:data
        },function(res){
            Tools.toast(res.desc || '提交成功',function(){
                location.href = config.PSaleDetail + '?id=' + id;
            });
        });
    });

    /**
     * 选择户型
     */
    body.on('click','.choose_hht',function(){
        $('body').css('overflow','hidden');
        $('.box,.box-layer').css({
            height:$('#sale_page').height() + 'px',
            display:'block'
        });
        initIScroll();
    });






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

/**
 * 设置图片数据
 * @param data
 */
function setImgData(data){
    var imgs = $('.upload_img');
    var imgArr = [];
    imgs.find('img').each(function(i,o){
        var o = {};
        o.imgAddress = $(this).attr('src');
        o.idx = i;
        imgArr.push(o);
    });
    data.houseImgs = imgArr;
}
/**
 * 表单验证
 * @param f
 * @returns {boolean}
 */
function validForm() {
    var entrustPrice = $('input[name="entrustPrice"]'),
        house = $('input[name="cHouse"]').val(),
        h_entrustPrice = $('input[name="h_entrustPrice"]');

    if(house.isEmpty()){
        return '请选择户型';
    }


    if(h_entrustPrice.val().isNumber2()){
        return '请填写正确的售价金额';
    }

    entrustPrice.val(parseFloat(h_entrustPrice.val())*10000);

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
 * 获取特色
 */
function setFeature(){
    Ajax.getDictionary({
        url:config.IDictionary,
        data:{
            flexValuekey:config.dictionary.Entrust_feature
        },
        renderFor:'rf_list_tmpl',
        renderEle:'#rf_list'
    });

}



/**
 * 初始化 滚动条
 */
function initIScroll(){
    new IScroll('#cHouse', {scrollY: true,momentum: false,snap: 'li'});
    new IScroll('#cHall', {scrollY: true,momentum: false,snap: 'li'});
    new IScroll('#cToilet', {scrollY: true,momentum: false,snap: 'li'});
}

/**
 * confirm btn
 */
body.on('click','#sure',function(){
    var cHouse = getContent('#cHouse'),
        cHall = getContent('#cHall'),
        cToilet = getContent('#cToilet'),
        result = $('[name="hht"]');

    $('[name="cHouse"]').val(cHouse);
    $('[name="cHall"]').val(cHall);
    $('[name="cToilet"]').val(cToilet);
    result.next().remove();
    result.val(cHouse + '室' + cHall + '厅'+ cToilet +'卫');

    //$('#close').trigger('click');
    $('body').css('overflow','');
    $('.box,.box-layer').hide();
});
/**
 * cancel btn
 */
body.on('click','#close',function(){
    $('body').css('overflow','');
    $('.box,.box-layer').hide();
});


/**
 * 获取滚动值
 * @param ele
 */
function getContent(ele){
    var $content = $(ele).find('div');
    var _height=$(ele).find('li').height();
    var tran = $content.css('transform') || $content.css('-webkit-transform');
    var top = tran.match(/\-?[0-9]+\.?[0-9]*/g)[1];
    var num=top/_height-1;
    return $(ele+" li").eq(-num).attr('data-val');
}
