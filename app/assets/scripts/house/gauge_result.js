(function(){
    var _route = location.href,
        id = _route.getQueryValue('id'),
        from = _route.getQueryValue('from'),
        type = _route.getQueryValue('t'),
        backUrl = config.PMyAsset,
        body = $('body');

    if (!id) {
        Tools.toast(config.tips.noauth);
        return;
    }

    //设置返回界面
    if (from) {
        backUrl = decodeURIComponent(from);
    }
    if (type && type !== 'my') {
        backUrl = config.POtherAsset;
    }

    /**
     * 获取评估结果详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:id}
    },function(res){
        /**
         * 绘制趋势图
         */
        if(!res.data.assessment.trend || !res.data.assessment.trend.length)return;
        drawLineChart('line', res.data.assessment.trend);
    });


    /**
     * 去吐槽
     */
    body.on('click', '#comment', function (e) {
        e.preventDefault();
        if(!$(this).attr('data-caseId')){
            Tools.toast('Can\'t not find CaseId！');
            return;
        }
        location.href = config.PComment + '?assessmentId=' + id + '&caseId=' + $(this).attr('data-caseId');
    });


    /**
     * 录入按揭信息
     */
    body.on('click','.go_anjie',function(e){
        e.preventDefault();
        location.href = config.PAddAnJie + '?id=' + id + '&from=' + encodeURIComponent(_route);
    });

    /**
     * 查看明细
     */
    body.on('click','.go_detail',function(e){
        e.preventDefault();
        location.href = config.PAnJieDetail + '?id=' + id;
    });


    /***
     * 删除资产
     */
    var option = {text: '确认删除该资产？'};
    $('.del_btn').click(function () {
        option.yesCb = function () {
            Ajax.custom({
                url: config.IDelAsset,
                data: {id: id}
            }, function () {
                location.href = backUrl;
            });
        };

        Tools.showConfrim(option);
    });


    /**
     * 获取是否出租出售情况
     */
    function hasSaleOrRent(type,callback){
        Ajax.custom({
            url:config.IGetEntrust,
            data:{
                personalId:id,
                type:type
            }
        },function(res){
            callback(res);
        });
    }


    /**
     * 出售按钮
     */
    function saleBtnEvent(res){
        var url = config.PSale;
        //不存在
        if(res.code !== '001'&& res.code === '0'){
             url = config.PSaleDetail;
        }
        body.on('click','#sale',function(){
            location.href = url  + '?id=' + id;
        });
    }
    hasSaleOrRent('2',saleBtnEvent);


    /**
     * 出租按钮
     */
    function rentBtnEvent(res) {
        var url = config.PRent;
        //不存在
        if(res.code !== '001'&& res.code === '0'){
            url = config.PRentDetail;
        }
        body.on('click','#rent',function(){
            location.href = url + '?id=' + id;
        });
    }
    hasSaleOrRent('1',rentBtnEvent);

    /**
     * 再融资
     */
    body.on('click','#finace',function(){
        var url = config.PAddAnJie;
        //已有按揭信息
        if($('.go_detail').length){
            url = config.PFinance;
            //已有再融资信息
            if ($('input[name="hasLoan"]').val()) {
                url = config.PFinanceDetail;
            }
        }
        location.href = url + '?id=' + id;
    });


    /**
     * 获取是否融资情况
     */
    Ajax.custom({
        url: config.IGetLoadDetail,
        data: {personalId: id, type: 1}
    }, function (res) {
        if (res.code === '0') {
            $('input[name="hasLoan"]').val(1);
        }
    });

})();

function drawLineChart(id,dataset){
    var container = document.getElementById(id),
        data = dataset,
        margin = {
            top:30,bottom:10,left:10,right:10
        },
        padding = {
            top:20,bottom:10,left:10,right:40
        },
        height = container.clientHeight,
        width = container.clientWidth,
        group_height = container.clientHeight - (margin.top + margin.bottom + padding.top + padding.bottom),
        group_width = container.clientWidth - (margin.left + margin.right + padding.left + padding.right);


    //创建 svg 元素
    var svg = d3.select('#'+ id)
        .append('svg')
        .attr('height',height)
        .attr('width',width);


    //定义缩放函数
    var scale_x = d3.scale.linear() // 通过d3 scale函数来对数据在svg中展示的比例进行调整，2个参数 domain：输入范围 range：输出范围
            .domain([d3.min(data,function(o){
                return o.month;
            }),d3.max(data,function(o){
                return o.month;
            })])
            .range([0,group_width]),

        min_val = d3.min(data,function(o){return o.avgPrice;}),

        max_val = d3.max(data,function(o){return o.avgPrice;}),

        step = (Math.ceil((max_val - min_val)/6000)*1000),

        case_one = Math.round((min_val - step)/1000) * 1000,

        case_tow = Math.round((min_val-step*2)/1000) * 1000,

        min_domain =(max_val - min_val > step*2 ? case_one : case_tow),

        temp_max_val = (min_val <= 0 ? 0 :min_domain) + step*6,

        y_range = (function(){
            var arr = [];
            for(var i =0;i<7;i++){
                arr.push(step*i);
            }
            return arr;
        })(),

        scale_y = d3.scale.linear()
            .domain([min_val <= 0 ? 0 : min_domain , max_val >= temp_max_val ? max_val : temp_max_val])
            .range([group_height,0]);

    log('max_val:'+max_val);
    log('min_val:'+min_val);
    log('Y_temp_max_val:' + temp_max_val);
    log('step:'+step);
    log('case_one:'+ case_one);
    log('case_tow:'+ case_tow);
    log('Y_min_val:'+ (min_val <= 0 ? 0 :min_domain));

    //定义包裹容器
    var main_group = svg.append('g') //组容器
        .attr('transform','translate('+ margin.left +','+ margin.top +')');


    //折线图片函数 需要参数 x,y 函数; area面积图表 需要参数 x,y0,y1  y0面积区域取值 y1为原数据取值
    var area_generator = d3.svg.area() //生成path d 属性点 M1,10L8,10  M表示起始点，L表示绘制线的下一个点
        .x(function(o){ //x点
            return scale_x(o.month);
        })
        .y0(group_height)  //面积取值范围
        .y1(function(o){ //y点
            return scale_y(o.avgPrice);
        }); // 线条展示样式 平滑曲线展示

    //添加区域面积
    main_group.append('path') //线元素
        .attr('d',area_generator(data)) //使用 d3 函数来计算点 scale 来进行比例缩放计算
        .attr('fill','#bfe6af');



    var line_generator = d3.svg.line() //生成path d 属性点 M1,10L8,10  M表示起始点，L表示绘制线的下一个点
        .x(function(o){ //x点
            return scale_x(o.month);
        })
        .y(function(o){ //y点
            return scale_y(o.avgPrice);
        }); // 线条展示样式 平滑曲线展示
    //添加线
    main_group.append('path') //线元素
        .attr('d',line_generator(data)) //使用 d3 函数来计算点 scale 来进行比例缩放计算
        .attr('class','line');


    //定义 x,y轴
    var x_axis = d3.svg.axis().scale(scale_x).ticks(6)
            .tickFormat(function(d){ //x 轴进行 比例缩放
                return d + '月';
            }),
        y_axis = d3.svg.axis().scale(scale_y).ticks(7,step).orient('right');//y 轴进行 比例缩放

    //添加 x轴
    main_group.append('g')
        .call(x_axis)
        .attr('transform','translate(0,'+group_height+')');

    //添加 y轴
    main_group.append('g')
        .call(y_axis)
        .attr('transform','translate('+group_width+',0)')
        .append('text')
        .text('(元)')
        .attr('dx','20px')
        .attr('dy','-15px');

    var circle_container = main_group.append('g');
    data.forEach(function(data,index){
        drawCircle(data,index);
    });

    //添加圆点
    function drawCircle(data,index){
        circle_container.datum(data)
            .append('circle')
            .attr('class','chart_circle')
            .attr( 'r', 0 )
            .attr('cx', line_generator.x())
            .attr('cy', line_generator.y())
            .transition()
            .delay(200 * index)
            .attr( 'r', 3 );
    }
}

