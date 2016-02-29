/**
 * Created by haner on 15/7/21.
 */

(function(){


    var id = location.href.getQueryValue('id'),
        financeId = location.href.getQueryValue('financeId'), //来自个人中心
        from = decodeURIComponent(location.href.getQueryValue('from')),
        body = $('body'),
        backUrl = config.PGaugeResult + '?id=' + id;

    if(from) backUrl = from;

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = backUrl;
    });

    /**
     * 获取详情
     */
    Ajax.queryRecord({
        url:config.IGetLoadDetail,
        data:{personalId:id,type:1,id:financeId}
    },function(res){
        $('input[name="personalId"]').val(id || res.data.personalId);
        //期限集值获取
        getLoanPlusPeriod(res.data.loanDeadline);
    });


    /**
     * 期限集值获取
     */
    function getLoanPlusPeriod(loanDeadline){
        if(!loanDeadline){return;}

        Ajax.getDictionary({
            url:config.IDictionary,
            data:{
                flexValuekey:config.dictionary.LoanApply_loanPlusPeriod
            }
        },function(res){
            //显示操作按钮
            $('.hide').css({display:'block'});
            for(var i in res){
                if(res[i].code == loanDeadline){
                    $('#loanDeadline').text(res[i].value);
                    break;
                }
            }
        });
    }

    /**
     * 利息计算
     */
    body.on('click','#calc_btn',function(){
        var _this = $(this);
        $('input[name="h_loanPrice"]').prop('disabled','true');
        Ajax.pageRequest({
            url:config.IGetRepaymentPlan,
            data:{
                personalId:$('input[name="personalId"]').val(),
                loanAmount:$('input[name="loanPrice"]').val(),
                loanPeriod:$('input[name="loanDeadline"]').val()
            }
        },function(res){
            //利息计算 layer show
            $('#interest').show();
            _this.remove();


            /**
             * 绘制环形图
             */
            var dataset = [];
            dataset.push({
                value:(res.data.interestTotal/10000 || 0).toFixed(1),
                label:'应还利息'
            });
            dataset.push({
                value:Math.round(res.data.loanAmount/10000 || 0),
                label:'应还本金'
            });

            dataset.push({
                value:(res.data.poundage/10000).toFixed(1) || 0,
                label:'手续费'
            } );

            drawPie('donut_chart',dataset);
            $('#interestTotal').text((res.data.interestTotal/10000 || 0).toFixed(1));
            $('#loanAmount').text(Math.round(res.data.loanAmount/10000 || 0));
            $('#poundage').text((res.data.poundage/10000).toFixed(1) || 0);

            //还款计划按钮事件
            $('#plan_btn').one('click',function(){
                getPlanList(res.data.lstRepayment);
                $(this).remove();
            });
        });



    });

    /**
     * 还款计划展示
     */
    function getPlanList(list){
        if(!list || !list.length) return;
        var html = '<li><p>期数</p><p>本金</p><p>利息</p></li>';
        for(var i in list){
            html += ('<li><p>'+list[i].period+'</p><p>' + (list[i].principal || 0) + '</p><p>'+ (list[i].interest || 0) + '</p></li>');
        }
        $('#plan_list').html(html);
    }


})();



function drawPie(id, data, centerText) {

    var container = document.getElementById(id),
        width = container.clientWidth,
        height = container.clientHeight,
        radius = Math.min(width, height) / 2;


    var svg = d3.select('#' + id).append("svg").attr('height',height - 30).append("g");

    //添加各个主元素块
    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    //数据获取函数
    var pie = d3.layout.pie().value(function (d) {
        return d.value;
    });

    // 圆环内边界
    var arc = d3.svg.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.7);

    // 文字，线外边界
    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.88);


    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    //颜色集
    var colorArray = function (i) {
        return ['#343E61', '#D02F27', '#890300'][i];
    };

    /* ------- 画圆 -------*/

    var slice = svg.select(".slices")
        .selectAll("path.slice")
        .data(pie(data))
        .enter()
        .append("path")
        .style("fill", function (d, i) {
            return colorArray(i);
        })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        });


    // 添加中心文字 label
    var lastArc = svg.select("g");
    var sum = (d3.sum(data,function(o){ return o.value;})).toFixed(1);
    lastArc.append("text")
        .attr("text-anchor","middle")
        .text(sum || 0)
        .attr('y', '15')
        .style('font-size', '24px')
        .append('tspan')
        .text(' 万')
        .style('font-size', '14px');

    lastArc.append("text")
        .text(centerText || '还款总额')
        .attr("text-anchor", "middle")
        .attr('y', '-10')
        .attr('fill', '#838BA2');
}

