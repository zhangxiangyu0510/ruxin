var commonUtil = require('../../utils/util');
var payUtil = require('../../utils/payUtils');
let payApi = require('../../config/api');
const payApp=getApp<IAppOption>();
let payMd5=require('../../utils/md5')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPaying: true,
    isSuccess: false,
    baseUrl: "https://api-mop.chinaums.com",
    pageTitle: '正在支付',
    orderId: '',
    orderNo: '',
    payNo: '',
    orderDetail: {}, // 订单信息
    payType:'',
    showPayDialog: false,
    dialogContent:'',
    errorFlag: false,
    payParams: {
        totalAmount: '',
        merOrderId: '',
        mid: '',
        tid: '',
        first: '',
        signKey: "8zb547izkeo3x4rnkdtjcyo1",
        mAppId: "8a81c1bf6cd9afd5016cfff762d00023", //服务端用appId
        mAppKey: "54002f78a4be48739e5303ebac6087fe", //服务端用AppKey
        miniPayRequest: '',
        saveminirequestpayurl: "",
        notifyUrl: "",
        merName: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
      //订单金额 流水号 订单id
      console.log('传过来的参数====',options);
   var options:any=JSON.parse(decodeURIComponent(options.params));
   console.log('传过来的参数1111====',options);
    if (options.orderId && options.payNo) {
        this.setData({
            orderId: options.orderId,
            payNo:options.payNo
        })
        if (options.payAmount > 0) {
            this.getpaymentParams(options.orderId, options.payNo)
        } else {
            this.setData({
                isPaying :false,
                isSuccess: true
            })
        }
    }
    if (options.orderNo) {
        const userInfo = wx.getStorageSync('userInfo');
        commonUtil.request(payApi.getPayParams,{ accountId: userInfo.accountId, orderId: options.orderNo },'get',true).then((res:any) => {
            console.log('获取参数======',res)
            if (res.data.success) {
                if (res.data.data.collageErrorCode) {
                    this.setData({
                        isPaying : false,
                        showPayDialog :true,
                        dialogContent:res.data.collageErrorMsg
                    });
                    return;
                }
                if (JSON.stringify(res.data) == "{}") {
                    wx.hideLoading()
                    wx.showModal({
                        content: '支付请求失败，请先取消本单并检查网络后重新提交新订单',
                        confirmText: '知道了',
                        showCancel: false,
                        confirmColor: '#008AB0',
                        success(res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                    return
                }
                let params = res.data.data[0]
                this.miniPayAction(params, options.orderNo)
            }
        })
    }
    if(options.payType && options.payType == 'collage') {
        this.setData({
            payType: options.payType,
            orderDetail:Object.assign({},wx.getStorageSync('orderDetail'))
        })
    }
    if (this.data.isPaying) {
        commonUtil.showOtherToast('支付中','loading',9000000)
    }

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  getpaymentParams(orderId:string,payNo:string,subAppId:string=payApp.globalData.payAppId,subOpenId:string='opA6-5WOQLFkLhjSiANdoca5o3i0') {
    commonUtil.request(`${payApi.getPay}?channelId=12&orderId=${orderId}&payNo=${payNo}&subAppId=${subAppId}&subOpenId=${subOpenId}`, {},'get',true).then((res:any) => {
        console.log('56789====',res);
            if (res.data.success) {
                if (res.data.data.collageErrorCode) {
                    this.setData({
                        isPaying:false,
                        showPayDialog:true,
                        dialogContent:res.data.data.collageErrorMsg
                    })
                    return;
                }
                this.initPay(res.data.data.data);
                this.setData({
                    orderNo:res.data.orderNo
                })
            } else {
                this.setData({
                    errorFlag:true,
                    isSuccess:false
                })
            }
            console.log('res=====',res);
        });
},
initPay (data:any) {
    console.log('data=====',data);
    this.setData({
        'payParams.saveminirequestpayurl':decodeURIComponent(data.saveminirequestpayurl),
        'payParams.notifyUrl':decodeURIComponent(data.backUrl)
    })
    let b = payUtil.decrypt(decodeURIComponent(data.data1), this.data.payParams.signKey);
    console.log('得到的b======',b);
    let paramJson = JSON.parse(b);
    this.setData({
        'payParams.totalAmount':paramJson.totalAmount,
        'payParams.merOrderId':paramJson.merOrderId,
        'payParams.mid':paramJson.mid,
        'payParams.tid':paramJson.tid,
        'payParams.first':paramJson.first
    });
    console.log('得到的payParams=====',this.data.payParams);
    if (this.data.payParams.first == "1") {
        console.log("first为1银商下单后调用微信支付")
        this.unifiedOrder()
     } else {
        console.log("first为0直接调用微信支付")
        this.data.payParams.miniPayRequest = JSON.parse(payUtil.decrypt(paramJson.miniPayRequest, this.data.payParams.signKey));
        this.miniPayAction('','');
     }
},
unifiedOrder () {
    let self=this;
    // const sessionInfo = uni.getStorageSync('sessionInfo')
    let time:any = new Date();
    payUtil.formatTime(time)
    let timestamp =  payUtil.formatTimeStr(time);
    let requestTimestamp = payUtil.formatTime(time);
    payUtil.formatTime(new Date(Date.parse(time) + 1000 * 60 * 60))
    let expireTime ='';
    console.log("订单过期时间：", expireTime)
    let random = Math.floor(Math.random() * 1000000000)
    let jsonobj = {
      requestTimestamp: requestTimestamp,
      expireTime: expireTime,
      merOrderId: this.data.payParams.merOrderId,
      mid: this.data.payParams.mid,
      tid: this.data.payParams.tid,
      notifyUrl: this.data.payParams.notifyUrl,
      instMid: "MINIDEFAULT",
      tradeType: "MINI",
      totalAmount: this.data.payParams.totalAmount,
      subAppid: payApp.globalData.payAppId,
      subOpenId: wx.getStorageSync('openId')
    }
    let jsonstr = JSON.stringify(jsonobj)
    console.log("jsonstr==" + jsonstr)
    let headers = payUtil.MakeHttpHead(this.data.payParams.mAppId, this.data.payParams.mAppKey, timestamp, random, jsonstr)
    let headstr = JSON.stringify(headers)
    wx.request({
        url: `${this.data.baseUrl}/v1/netpay/wx/unified-order`,
        method: 'POST',
        data: jsonobj,
        header: headers,
        success: (res:any) => {
            console.log("银商下单返回参数：", res)
            if (res.statusCode != 200) {
                console.log('创建支付订单失败')
                    commonUtil.showErrorToast('您的手机时间与当前时间不符，请修改后重试')
            } else {
                //正确返回结果
                if (res.data.errCode != "SUCCESS") { //下单失败
                    console.log('交易失败')
                    commonUtil.showErrorToast('您的手机时间与当前时间不符，请修改后重试')
                    return
                }
                let miniPayRequest = res.data.miniPayRequest;
                self.setData({
                    'payParams.merName' : res.data.merName ,
                    'payParams.miniPayRequest': miniPayRequest
                })
                // this.data.payParams.merName = res.data.merName
                // this.payParams.miniPayRequest = miniPayRequest
                //传送miniPayRequset
                let headers = {
                  'Content-Type': 'application/json;charset=UTF-8'
                }
                let miniPayRequest3DES = payUtil.encrypt(JSON.stringify(miniPayRequest), this.data.payParams.signKey)
                let signMiniPayRequest3DES = payMd5.hexMD5(miniPayRequest3DES + this.data.payParams.signKey).toLocaleUpperCase()
                let miniPayRequestObj = {
                    merOrderId: this.data.payParams.merOrderId,
                    miniPayRequest: miniPayRequest3DES,
                    sign: signMiniPayRequest3DES
                };
                this.miniPayAction('','');
            }
        }
    })
},
miniPayAction (params:any, orderId:any) {
    let miniPayRequest= {};
    if (params) {
        let payParams =Object.assign({},params);
        delete payParams.orderId
        delete payParams.merOrderId
        delete payParams.mid
        delete payParams.tid
        miniPayRequest = payParams
    } else {
        miniPayRequest = this.data.payParams.miniPayRequest
    }
    let that = this;
    let dealObj=Object.assign(miniPayRequest,{provider:'wxpay'});
    wx.requestPayment({
        'provider':'wxpay',
        ...miniPayRequest,
        complete (res) {
            that.queryStatus(res, orderId, params)
        }
    })
    // that.queryStatus(res, orderId, params)
},
queryStatus (data:any, orderId:string, params:any) {
    if (data.errMsg == "requestPayment:fail cancel") {
        wx.showLoading({
            title: '用户取消交易',
            mask: true
        })
        if (!orderId) {
            const extraParams = {
                merOrderId: this.data.payParams.merOrderId,
                mid: this.data.payParams.mid,
                tid: this.data.payParams.tid
            }
            const assignObj=Object.assign({},this.data.payParams.miniPayRequest,extraParams,{orderId: this.data.orderId})
            commonUtil.request(`${payApi.addPayParam}?accountId=${wx.getStorageSync('userInfo').accountId}`,assignObj,'post',true).then(()=> {
            })
        }
        wx.redirectTo({
            url: `/pages/customerPage/index?url=${payApp.globalData.h5Address}orderList&params=${encodeURIComponent(JSON.stringify(Object.assign(commonUtil.getCommonArguments(),{orderIndex:0})))}`
        })
        return;
    }
    let time = new Date()
    let timestamp = payUtil.formatTimeStr(time)
    let requestTimestamp = payUtil.formatTime(time)
    let random = Math.floor(Math.random() * 1000000000);
    const extraParams = {
        merOrderId: this.data.payParams.merOrderId,
        mid: this.data.payParams.mid,
        tid: this.data.payParams.tid
    }
    let jsonobj = {
      requestTimestamp: requestTimestamp,
      merOrderId: orderId ? params.merOrderId : this.data.payParams.merOrderId,
      mid: orderId ? params.mid : this.data.payParams.mid,
      tid: orderId ? params.tid : this.data.payParams.tid,
      instMid: "MINIDEFAULT"
    }
    let jsonstr = JSON.stringify(jsonobj)
    let headers = payUtil.MakeHttpHead(this.data.payParams.mAppId, this.data.payParams.mAppKey, timestamp, random, jsonstr)
    let headstr = JSON.stringify(headers)
    wx.request({
        url: `${this.data.baseUrl}/v1/netpay/query`,
        method: 'POST',
        data: jsonobj,
        header: headers,
        success: (res) => {
            this.setPayRet(res.data, orderId)
        }
    })
},
setPayRet (data:any, orderId:any) {
    if (data.status == "TRADE_SUCCESS") {
        this.setData({
            isSuccess: true,
            isPaying:false
        })
       wx.hideLoading();
       this.setData({
        pageTitle:'支付成功'
       });
         this.payAndFollow(this.data.orderId);
        // this.$store.dispatch('cart/getUserInfo')
        if (orderId) {
            // const userInfo = wx.getStorageSync('userInfo')
            commonUtil.request(payApi.deletePayParams,{accountId:wx.getStorageSync('userInfo').accountId,orderId},'',true).then(()=>{})
        }
        console.log(orderId,"重新付款调取接口")
        let params = {
            nuskinOrderId: orderId ? orderId : this.data.orderId
        }
        //支付成功---todo关注当前店主
        // collageApi.paySuccess(params)
        wx.redirectTo({
            url: `/pages/customerPage/index?url=${payApp.globalData.h5Address}orderList&params=${encodeURIComponent(JSON.stringify(Object.assign(commonUtil.getCommonArguments(),{orderIndex:2})))}`
        })
    } else {
        this.setData({
            isSuccess:false
        })
        wx.redirectTo({
            url: `/pages/customerPage/index?url=${payApp.globalData.h5Address}orderList&params=${encodeURIComponent(JSON.stringify(Object.assign(commonUtil.getCommonArguments(),{orderIndex:1})))}`
        })
    }
},
payAndFollow(orderId:string) {
      commonUtil.request(payApi.payAndFollow, { shopId: wx.getStorageSync('shopInfo').shop.id, orderId:orderId}, 'post').then((res: any) => {
        console.log('关注店铺吗=====', res);
        if (res && res.data) {
          wx.setStorageSync('paySuccess',true);
        }
      })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

})