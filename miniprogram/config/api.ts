//=====dev环境=======
// const ApiRootUrl = 'https://myshop-dev.cn.nuskin.com/api/nuskin-myshop-user/myshop-dev/nuskin-myshop-user/';
// const ApiShoppingUrl = 'https://weshop-dev.cn.nuskin.com/';
// const keyWord = 'Wechat_Shop_Dev_default'
//=====dev环境=======
//=====qa环境=======
// const ApiRootUrl = 'https://myshop-test.cn.nuskin.com/api/nuskin-myshop-user/myshop-test/nuskin-myshop-user/';
// const ApiShoppingUrl = 'https://weshop-dev.cn.nuskin.com/';
// const keyWord = 'Wechat_Shop_Dev_default'
//=====qa环境=======
//=====stage环境=======
const ApiRootUrl = 'https://myshop-stage.cn.nuskin.com/api/nuskin-myshop-user/myshop-stage/nuskin-myshop-user/';
const ApiShoppingUrl = 'https://weshop-stage.cn.nuskin.com/';
const keyWord = 'Wechat_Shop_Stage_default'
//=====stage环境=======
//=====线上环境=======
// const ApiRootUrl = 'https://myshop.cn.nuskin.com/api/nuskin-myshop-user/myshop-prod/nuskin-myshop-user/';
// const ApiShoppingUrl = 'https://weshop.cn.nuskin.com/';
// const keyWord = 'Wechat_Shop_Prod_default'
//=====线上环境=======
module.exports = {
    //获取token
    getToken: ApiRootUrl + 'login/login_wechat',
    //我的订单--数量提示弹窗
    getOrderStatusCount: ApiRootUrl + 'user/order/orderStatusCount',
    //微信一键登录
    AuthLoginByWeixin: ApiRootUrl + 'login/login',
    //获取消息通知模板
    getSendId: ApiRootUrl + 'subscribe_message/tmp_id',
    getSaveFlag: ApiRootUrl + 'subscribe_message/save_flag',
    //客服电话
    customerService: ApiRootUrl + 'user-config/official_telephone',
    //获取图形证码
    getPhoneImgCode: ApiRootUrl + 'login/graphic',
    //获取手机验证码
    getPhoneCode: ApiRootUrl + 'login/shot_message_code',
    //协议(用户已登录)
    getProtocols: ApiRootUrl + 'user-term/list',
    //协议(用户未登录)
    getNoLoginProtocols: ApiRootUrl + 'user-term/list_not_login',
    //保存协议(用户已登录)
    saveProtocols: ApiRootUrl + 'user-term/save',
    // 用户注册店铺
    getStoreRegistration: ApiRootUrl + 'userPartner/verifyCustomerQualification',
    //banner列表
    bannerList: ApiRootUrl + 'user/banner/list',
    //查看用户是否关注
    isFollow: ApiRootUrl + 'user/follow',
    //获取是否拥有新人优惠
    newUserPrice: ApiRootUrl + 'user/new_user_price',
    //关注/user/follow
    follow: ApiRootUrl + 'user/follow',
    //取关/user/follow/cancel
    cancelFollow: ApiRootUrl + 'user/follow/cancel',
    // 如新优选
    optimizationAll: ApiRootUrl + 'optimization/all',
    // 获取产品详情
    optimizationDetail: ApiRootUrl + 'optimization/',
    //登录后获取用户信息
    getUserInfo: ApiRootUrl + 'user',
    //获取用户en悦家点数
    getSelfEnNumber: ApiRootUrl + 'user/getSelfEnNumber',
    // 获取产品一级分类
    getClassify: ApiRootUrl + 'user/product/classify',
    // 根据一级类目ID查询子类目信息
    getClassifyChild: ApiRootUrl + 'user/product/children/classify',
    // 根据二级类目id查询产品列表
    getProductList: ApiRootUrl + 'user/product/list',
    //欧巧巧添加
    updateVisitTime: ApiRootUrl + 'user/updateVisitTime',
    // 头像上传
    UploadAvatar: ApiRootUrl + 'cos',
    // 店主推荐
    recommendation: ApiRootUrl + 'user/recommendation/list',
    // 店主推荐（分类）
    recommendationSearch: ApiRootUrl + 'user/recommendation/search',
    // 店铺分享
    shareShop: ApiRootUrl + 'share/shop',
    // h5商品分享
    shareProduct: ApiRootUrl + 'share/product',
    // 查询关注店铺
    userFollow: ApiRootUrl + 'user/follow',
    // 获取店铺信息
    getShopInfo: ApiRootUrl + 'shop',
    //注册并登录
    registerLogin: ApiRootUrl + 'login/register',
    // 条款协议列表
    getTermList: ApiRootUrl + 'shop/getClauseManageList',
    getTermdetails: ApiRootUrl + 'shop/getClauseDetail',
    getNewTermdetails: ApiRootUrl + 'shop/getPrivateClause',
    //h5商城token
    getH5Token: ApiRootUrl + 'h5/get_shop_token',
    //投诉与反馈
    postComplaints: ApiRootUrl + 'backAndComplaint/addComplaint',
    // 投诉与反馈历史列表
    getComplaintsList: ApiRootUrl + 'backAndComplaint/getHistoryList',
    // 投诉与反馈详情
    getComplaintsDetail: ApiRootUrl + 'backAndComplaint/getHistoryDetail',
    // 新手引导
    noviceGuideDone: ApiRootUrl + 'novice/guide/done',
    // 获取是否需要
    noviceGuideRecommendation: ApiRootUrl + 'novice/guide/get/recommendation',
    // 组合商品分享
    shareCombProduct: ApiRootUrl + 'share/combProduct',
    //未登录主题色
    getNoLoginTheme: ApiRootUrl + 'skinController/getTopicColor',
    //登录主题色
    getLoginTheme: ApiRootUrl + 'skinController/getSkin',
    // 记录用户最后浏览店铺
    getLastBrowseShop: ApiRootUrl + 'novice/guide/takeNote',
    // 获取用户上次浏览店铺信息
    getLastShopId: ApiRootUrl + 'novice/guide/get/shopId',
    // 地址
    optimizationAreas: ApiRootUrl + 'optimization/areas',
    // 加入购物车
    cartMerge: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/myshop/cart/merge`,
    // 查询是否是套装产品
    cartTip: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/myshop/cart/tip?code=DO_POP_DISCLAIMER`,
    // 用户地址列表
    addressList: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/address/list`,
    // 查询商品库存
    cartGetStockQty: 'HTTPS://1000112.cn.nuskin.com/nuskin-cn-service-search/api/v1/nuskin/open/item/query/status',
    // 查询商品库存（耿涛）
    productStatus: ApiRootUrl + 'user/product/status',

    // 单品加入购物车
    cart: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/myshop/cart`,
    // 'https://myshop-test.cn.nuskin.com/api/nuskin-myshop-shopkeeper/myshop-test/nuskin-myshop-shopkeeper/'
    // 订单评价
    orderRate: ApiRootUrl + 'user/order/rate',
    // 订单详情
    orderDetail: ApiRootUrl + 'user/order/detail',
    // 机器码提交
    ageLockMeCode: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/ageLockMe`,
    // 获取所有点亮的徽章
    getBadge: ApiRootUrl + 'badge',
    // 获取最后点亮的徽章
    getLast_lighting: ApiRootUrl + 'badge/last_lighting',
    //银商
    repay: 'https://api-mop.chinaums.com/v1/netpay/wx/unified-order',
    //支付1
    getPay: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/myshop/order/netpay`,
    //订单支付
    orderPay: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/myshop/order/quickpay`,
    // 写入缓存
    addPayParam: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/order/addPayParam`,
    //获取缓存
    getPayParams: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/order/getPayParamList`,
    //删除缓存
    deletePayParam: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/order/deletePayParam`,
    //获取所有徽章
    getAllBadge: ApiRootUrl + 'badge/all',
    //获取店铺配置信息
    getShopConfig: ApiRootUrl + 'shop/get_config',
    //是否申请成为店主
    getRegisterShopkeeper: ApiRootUrl + 'userPartner/checkShopInfo',
    //下单后自动关注
    payAndFollow: ApiRootUrl + 'user/follow/auto',
    //小组成员
    groupPeople: ApiRootUrl + 'im/enabled',
    // 记录粉丝
    chatLastTime: ApiRootUrl + 'user/record/chat/lastTime',
    //了解如新
    konwNuskin: ApiRootUrl + 'novice/guide/view_nuskin',
    // 查询尊享码列表
    agelocmeList: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/goods/agelocme/list`,
    // 购物车数量
    cartCount: ApiShoppingUrl + `api/business/${keyWord}/nuskin-shop-business-center/myshop/cart/count`,



};