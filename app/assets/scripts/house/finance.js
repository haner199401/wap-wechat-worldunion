/**
 * Created by haner on 15/7/21.
 */

(function(){

    var id = location.href.getQueryValue('id'),
        body = $('body');

    /**
     * 返回
     */
    $('.icon_back').on('click',function(){
        location.href = config.PGaugeResult + '?id=' + id;
    });

    if(!id){
        Tools.toast(config.tips.noauth);
        return;
    }

    /**
     * 获取详情
     */
    Ajax.queryRecord({
        url:config.IGaugeResult,
        data:{id:id}
    },function(){
        //设置可贷金额
        getCreditAmount();
        //期限集值获取
        getLoanPlusPeriod();
    });

    /**
     * 获取可贷金额
     */
    function getCreditAmount(){
        Ajax.custom({
            url:config.IGetCreditAmount,
            data:{personalId:id}
        },function(res){
            if(res.code === '005' || res.code === '01'){setTimeout('history.go(-1)',1000);return;}

            var money = res.data.plusCreditAmount || 0;
            //设置可贷金额
            $('#gauge_money').text(Math.floor(money/10000));
            $('input[name="loanableFunds"]').val(money);
            //显示操作按钮
            $('.hide').css({display:'block'});
            //set other param
            $('input[name="personalId"]').val(id);
        });
    }

    /**
     * 期限集值获取
     */
    function getLoanPlusPeriod(){
        Ajax.getDictionary({
            url:config.IDictionary,
            data:{
                flexValuekey:config.dictionary.LoanApply_loanPlusPeriod
            }
        },function(res){
            var html = '',
                date = $('#date-list');
            for(var i in res){
                html += ('<option value="'+ res[i].code +'">' + res[i].value + '</option>');
            }
            date.html(html);date.trigger('change');
        });
    }

    /**
     * 期限选择事件
     */
    body.on('change','#date-list',function(){
        $(this).prev('input').val($('#date-list option:selected').text());
    });


    /**
     * 再融资数据提交
     */
    body.on('click','#submit_btn',function(){
        var msg = '';
        if (!!(msg = validForm())) {
            Tools.toast(msg);
            return;
        }
        Ajax.submitForm({
            url:config.ISaveLoad,
            data:$('#wu-detail')
        },function(){
            Tools.showTip({
                btnsText:['查看再融资状态'],
                text:'您的再融资申请已提交,请耐心等待',
                yesCb:function(){
                    location.href = config.PFinanceDetail + '?id=' + id;
                }
            });
        });
    });


    /**
     * 利息计算
     */
    body.on('click','#calc_btn',function(){
        var msg = '';
        if (!!(msg = validForm2())) {
            Tools.toast(msg);
            return;
        }

        $('input[name="h_loanPrice"]').prop('disabled','true');
        var _this = $(this);

        Ajax.pageRequest({
            url:config.IGetRepaymentPlan,
            data:{
                personalId:id,
                loanAmount:$('input[name="loanPrice"]').val(),
                loanPeriod:$('#date-list').val()
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

/**
 * 表单验证
 */
function validForm(){
    var idCard = $('input[name="identityCard"]').val(),//身份证
        loanPrice = $('input[name="h_loanPrice"]'),
        fullName = $('input[name="fullName"]'),
        _loanPrice = $('input[name="loanPrice"]'); //申请金额

    if(fullName.val().isEmpty()){
        return '请填写真实姓名！';
    }

    if(!idCard.isIDCard()){
        return '请填写正确的身份证号码';
    }

    if(loanPrice.val().isNumber2()){
        return '请填写正确的贷款金额';
    }

    if(parseFloat(loanPrice.val()) > parseFloat($('#gauge_money').text())){
        return '贷款金额超出了可贷金额';
    }

    _loanPrice.val(parseFloat(loanPrice.val())*10000);


}
/**
 * 利息计算表单验证
 */
function validForm2(){
    var  loanPrice = $('input[name="h_loanPrice"]'),
        _loanPrice = $('input[name="loanPrice"]'); //申请金额

    if(loanPrice.val().isNumber2()){
        return '请填写正确的贷款金额';
    }

    if(parseFloat(loanPrice.val()) > parseFloat($('#gauge_money').text())){
        return '贷款金额超出了可贷金额';
    }

    _loanPrice.val(parseFloat(loanPrice.val())*10000);

}


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

