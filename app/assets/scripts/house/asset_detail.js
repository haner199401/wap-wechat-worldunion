/**
 * Created by haner on 15/7/21.
 */

(function(){
    var id = location.href.getQueryValue('id');
    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href =config.PGaugeResult + '?id=' + id;
    });

    /**
     * 获取评估结果详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:id}
    },function(res){

        var dataset = [
            {
                value:res.data.assetTotal || 0,
                label:'净资产'
            },{
                value:res.data.unPrincipal || 0,
                label:'未还本金'
            }];

        drawPie('donut_chart',dataset,'评估价格');

    });

    config.pageRequest = function(){
        Ajax.pageRequest({
            url:config.IGetRefundPlan,
            data:{personalId:id},
            clear:'no'
        });
    };

    config.pageRequest();

    //查看按揭信息
    $('#go_anjie').on('click',function(e){
        location.href = config.PAddAnJie + '?id=' + id  + '&from=' + encodeURIComponent(location.href);
    });

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
    }).sort(null);

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
        return ['#D02F27','#343E61', '#890300'][i];
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

    /* -------  文字 label-------*/

    var text = svg.select(".labels").selectAll("text")
        .data(pie(data))
        .enter()
        .append("g");

    //添加文字
    text.append("text")
        .attr("dy", "1.35em")
        .attr('fill', '#838BA2')
        .style('font-size', '12px')
        .text(function (d) {
            return d.data.label;
        });

    //添加数字
    text.append("text")
        .attr('fill', function (d, i) {
            return colorArray(i);
        })
        .style('font-size', '20px')
        .text(function (d) {
            return Math.round(d.data.value / 10000);
        })
        .append('tspan')
        .style('font-size', '14px')
        .text(' 万');

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text.transition().duration(1000)
        .attrTween("transform", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 0.93 : -0.93);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        });


    // 添加中心文字 label
    var lastArc = svg.select("g");
    var sum = Math.round(d3.sum(data,function(o){ return o.value;})/10000);
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


    /* ------- 画线 -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data))
        .enter()
        .append("polyline")
        .transition()
        .attrTween("points", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.88 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        })
        .style('stroke', function (d, i) {
            return colorArray(i);
        });
}

