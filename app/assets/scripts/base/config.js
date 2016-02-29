/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 接口地址
 * 测试服务器 http://zcbapi.fanglb.com:8888
 * 开发服务器 http://zcbdev.worldunion.com.cn:8282
 * 本地测试地址 http://192.168.1.152
 */

var is8282Server = !!0;

var config = {
	projectName: is8282Server ? '/wu-asset-appinterface':'',
	page: 1, //当前第几页，从1开始
	pageSize: 10, //默认分页大小,
	totalPage: 0, //总页数,
	pageRequest: undefined,
	currentPage: 1,
    baseUrl: is8282Server ? 'http://zcbdev.worldunion.com.cn:8282' : 'http://zcbdev.worldunion.com.cn:8383',
    interfaceSuffix: '',
	pageSuffix: '.html'
};

//server address
config.server = config.baseUrl ? (config.baseUrl + config.projectName) : (location.protocol + '//' + location.host + config.projectName + '/');
//config.server = 'http://10.0.16.60:8080//wu-asset-appinterface';

//page address
config.pageServer = location.protocol + '//' + location.host;
//图片服务器地址
config.imageServer = config.server + '/api/pictureapi' + config.interfaceSuffix;
//接口根地址
config.interfaceServer = config.server + '/api/';
//load img
config.loadMoreImg = '/assets/images/ajax-loader.gif';

//文件存放地址
config.IFileServer = config.interfaceServer + 'photoUpload';


/**
 * Main Interface
 */
config.ISendMsg = config.interfaceServer + 'account/sendAuthCode';//3.3.1.	发送验证码(张腾)
config.ILogin = config.interfaceServer + 'account/login';//3.2. 登陆接口(张腾)
config.ICompareCity = config.interfaceServer + 'project/getCity';//3.4.1.	查询城市(张腾)


/**
 * Asset Interface
 */
config.ICityList = config.interfaceServer + 'project/getCityList';//城市列表
config.IHasCity = config.interfaceServer + 'project/getCity';//是否存在城市
config.IProjectList = config.interfaceServer + 'project/getProjectList';//获取楼盘
config.IBuildList = config.interfaceServer + 'project/getBuildList';//获取楼栋
config.IRoomNumber = config.interfaceServer + 'project/getRoomList';//获取房号
config.IAddMyAsset = config.interfaceServer + 'persional/getAssetment';//3.6.3.	保存我的资产(资产估价) (张腾)
config.IGaugeResult = config.interfaceServer + 'persional/getPersionalVo';//3.6.2.	查询资产详情(张腾)
config.IComment = config.interfaceServer + 'correction/insertCorrection';//3.5.7.	纠错/吐槽（屈金辉）
config.IDelAsset = config.interfaceServer + 'persional/deletePersional';//3.6.11.	移除我的资产（屈金辉）
config.ISaveAnjie = config.interfaceServer + 'mortgage/saveMyMortgage';//3.6.6.	添加按揭信息(张腾)
config.IUpdateAnjie = config.interfaceServer + 'mortgage/updateMyMortgage';//3.6.6.	更新按揭信息(张腾)
config.IGetRefundPlan = config.interfaceServer + 'refund/getRefundList';//3.6.5.	查询我的还款计划(张腾)
config.IGetAnJieDetail = config.interfaceServer + 'mortgage/findMyMortgageList';//3.6.4.	查询按揭信息(张腾)
config.IAddRefundRecord = config.interfaceServer + 'mortgage/saveAheadRefund';//3.6.9.	添加提前还款记录(张腾)
config.IUpdateRefundRecord = config.interfaceServer + 'mortgage/updateAheadRefund';//3.6.10.	修改提前还款记录(张腾)
config.IDelRefundRecord = config.interfaceServer + 'mortgage/deleteAheadRefund';//3.6.10.	删除提前还款记录(张腾)
config.IFindRefundRecord = config.interfaceServer + 'mortgage/findAheadRefund';//3.6.10.	查找提前还款记录(张腾)
config.IFindRefundRecordList = config.interfaceServer + 'mortgage/findAheadRefundList';//3.6.10.	查找提前还款记录列表(张腾)
config.ISaveEntrust = config.interfaceServer + 'entrust/saveEntrust';//3.5.10.	保存出售出租我要买信息(刘波)
config.IGetEntrust = config.interfaceServer + 'entrust/getEntrustByPersonalId';//3.5.11.	获取出租出售信息(刘波)
config.IGetEntrustById = config.interfaceServer + 'entrust/getEntrust';//3.5.11.	获取出租出售我要买信息(刘波)
config.IGetCreditAmount = config.interfaceServer + 'loanPrice/calcuPlusCreditAmount';//3.6.15.	再融资查询可贷金额(+贷)(张腾)
config.ISaveLoad = config.interfaceServer + 'loanApply/insertLoanApply';//3.8.1.	保存我要贷款申请，再融资申请（屈金辉）
config.IGetLoadDetail = config.interfaceServer + 'loanApply/getLoanApply';//3.8.3.	获取贷款明细（屈金辉）
config.IGetRepaymentPlan = config.interfaceServer + 'loanPrice/getRepaymentPlan';//3.6.16.	获取再融资还款计划及利息(张腾)

/**
 * Care Asset
 */
config.IGetTaxesDetail = config.interfaceServer + 'taxesDetai/getTaxesDetail';//3.7.6.	获取房号税费明细及总额信息(刘波)
config.ISaveOrUpdatePropretyInfo = config.interfaceServer + 'assetTotal/saveAssetTotal';//3.7.6.3.7.3.	保存产权信息和税费总额明细(刘波)
config.IGetPropretyInfo = config.interfaceServer + 'assetTotal/getAssetTotal';//3.7.5.	获取产权信息(刘波)
config.IGetOtherCreditAmount = config.interfaceServer + 'loanApply/getCreditAmount';//3.8.4.	获取可贷金额(置业贷)(屈金辉)
config.IGetOtherRepaymentPlan = config.interfaceServer + 'loanApply/getRepaymentPlan';//3.8.4.	获取可贷金额(置业贷)(屈金辉)

/**
 * Personal Interface
 */
config.IMyAssets = config.interfaceServer + 'persional/getPersionalList';//3.6.1.	查询用户资产列表(张腾)
config.IMyInfo = config.interfaceServer + 'account/appUserInfo';//3.3.2.	获取个人基本信息(张腾)
config.IMyJiedai = config.interfaceServer + 'loanApply/getLoanApplyList';//3.8.2.	获取我的贷款申请列表（屈金辉）
config.IMyWeituo = config.interfaceServer + 'entrust/getEntrustList';// 3.3.6.	获取我的委托(租\售\买)(刘波)
config.ISaveFeedBack = config.interfaceServer + 'common/saveFeedBack';// 3.4.9.	保存反馈信息(张腾)
config.IChangeUserMobile = config.interfaceServer + 'account/changeUserMobile';// 3.5.6.	修改手机号(张腾)
config.IUpdateUserInfo = config.interfaceServer + 'account/updateUserInfo';// 3.5.5.	修改个人资料(张腾)

/**
 * my loan
 */

config.ISaveLoanAsset = config.interfaceServer + 'persional/getAssetmentForLoanApply';//3.6.4.	保存资产(我要贷款) (张腾)

/**
 * other interface
 */
config.IDictionary = config.interfaceServer + 'flex/getFlexValue';//3.4.6.	获取后台值集  (刘波)



/**
 * pages
 * @returns {*}
 */
config.PLogin = createPageUrl('login');//登录
config.PIndex = createPageUrl('index');//首页
config.PNoAsset = createPageUrl('house','noHouse');//无资产页面
config.PNoOtherAsset = createPageUrl('other-house','other_noHouse');//无资产页面(关注)
config.PAssetDetail = createPageUrl('house','assetDetail');//资产详情
config.PGaugeResult = createPageUrl('house','gaugeResult');//自有房评估结果
config.POtherGaugeResult = createPageUrl('other-house','gaugeResult');//关注资产评估结果
config.PComment = createPageUrl('house','comment'); //吐槽
config.PMyAsset = createPageUrl('house','myHouse'); //我的资产
config.POtherAsset = createPageUrl('other-house','otherHouse'); //我关注的资产
config.PAddAnJie = createPageUrl('house','addAnjie'); // 按揭信息录入
config.PAnJieDetail = createPageUrl('house','assetDetail'); // 按揭明细
config.PGetRentuMoneyRecord = createPageUrl('house','record'); // 提前还款记录列表
config.PAddRecord = createPageUrl('house','repaymentRecord'); // 添加还款记录
config.PAddHouse = createPageUrl('house','addHouse'); // 添加房产
config.PSale = createPageUrl('house','sale'); // 出售
config.PSaleDetail = createPageUrl('house','saled'); // 出售详情
config.PRent = createPageUrl('house','rent'); // 出租
config.PRentDetail = createPageUrl('house','rented'); // 出租详情

config.PFinance = createPageUrl('house','finance'); // 再融资
config.PFinanceDetail = createPageUrl('house','financed'); // 再融资详情
config.PLoan = createPageUrl('other-house','loan'); //贷款申请
config.PLoanDetail = createPageUrl('other-house','loaned'); //贷款详情

config.PBug = createPageUrl('other-house','bug'); // 我要买页面
config.PBuged = createPageUrl('other-house','bug_detail'); // 我要买详情

config.PMyCenter = createPageUrl('personal','personalCenter'); // 个人中心首页
config.PMyBuged = createPageUrl('personal','buged'); // 我要买详情
config.PMyRented = createPageUrl('personal','rented'); // 我要买详情
config.PMySaled = createPageUrl('personal','saled'); // 我要买详情
config.PMyFinanceDetail = createPageUrl('personal','financed'); // 再融资详情
config.PMyPLoanDetail = createPageUrl('personal','loaned'); // 再融资详情

config.PInputProperty = createPageUrl('other-house','property_input'); //录入产权信息
config.PApplyLoad = createPageUrl('other-house','apply_loan'); //申请我要贷款（已录入产权信息页面）
config.PApplyLoadAll = createPageUrl('other-house','apply_loan_all'); //申请我要贷款（全字段）

config.PGaugeFail = createPageUrl('gauge_fail'); //评估失败
config.POtherGaugeFail = createPageUrl('other_gauge_fail'); //评估失败


/**
 * Tips
 */
config.tips = {
    server: '服务器异常，请稍后再试～',
    timeout: '请求超时啦，请重试～',
    nodata: '没有数据啦~',
    nomoredata: '没有更多数据啦~',
    loading: '加载中…',
    locationerror:'定位失败,请手动选择城市！',
    noauth:'非法请求！',
    fileTypeError:'仅支持jpg、jpeg、png格式！'
};


/**
 * Sign Param
 * @type {string}
 */

config.signaParam = {
    apikey: 'asset',
    deviceId: '',
    deviceType: 'web',
    version: '1.0'
};

/**
 * 字典 接口 类型
 */
config.dictionary = {
    Message_modelType: 'Message_modelType',
    Message_type: 'Message_type',
    Message_readStatus: 'Message_readStatus',
    FeedBack_type: 'FeedBack_type',
    Entrust_decoration: 'Entrust_decoration', //装修情况
    Persional_type: 'Persional_type',
    MortgageInfo_loanType: 'MortgageInfo_loanType',
    MortgageInfo_refundMode: 'MortgageInfo_refundMode',
    MortgageInfo_contractRate: 'MortgageInfo_contractRate',
    AheadRefund_refundType: 'AheadRefund_refundType',
    Total_estateType: 'Total_estateType',
    Total_ownerType: 'Total_ownerType',
    LoanApply_status: 'LoanApply_status',
    LoanApply_type: 'LoanApply_type',
    Entrust_necessarySettings: 'Entrust_necessarySettings',
    Entrust_type: 'Entrust_type',
    Entrust_status: 'Entrust_status',
    Base_status: 'Base_status',
    Entrust_feature: 'Entrust_feature',//特色
    LoanApply_loanPlusPeriod: 'LoanApply_loanPlusPeriod',//特色
    LoanApply_loanHomePeriod: 'LoanApply_loanHomePeriod',//特色
    SUGGEST_NO_PROJECT_FLAG:'3',
    SUGGEST_NO_BUILD_FLAG:'2',
    SUGGEST_NO_ROOM_Flag:'1',
    SUGGEST_Flag:'4'
};

/**
 * 枚举罗列
 * @type {string}
 */
config.enum = {
    //发送验证码类型
    sendCodetType: {
        login:1,
        forgetPwd:2
    },
    //资源类型
    assetType: {
        myAsset: 1,
        careAsset: 2
    }
};



function createPageUrl() {
    if (!arguments.length) return;
    var n = '';
    for (i in arguments) {
        if (!arguments[i]) return n;
        if (arguments[i].charAt(0) !== '/') arguments[i] = '/' + arguments[i];
        if (arguments[i].charAt(arguments[i].length) !== '/') arguments[i] += '/';
        n += arguments[i];
    }
    if (!n.length) return n;
    n = n.replace(/\/\//g, '/');
    return config.pageServer + n.substr(0, n.length - 1) + config.pageSuffix;
}