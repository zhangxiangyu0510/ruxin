// pages/customerPage/index.ts
var api = require('../../config/api')
var util = require('../../utils/util');
const customApp = getApp<IAppOption>();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc: '',
    newUrl: '',
    agreementsObj: {},
    options: { url: '', params: '', flag: '', orderId: '', title: '', shopId: '', tc: '', currentTime: '',orderIndex:'' },
    pageType: '',
    keyword: '',
    time: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    console.log('options11111=====', options);
    this.setData({
      options
    });
    console.log('options22222=====', options);
    if (options.url) {
      this.data.newUrl = options.url;
      wx.setStorageSync('initRoute', options.url);
    }
    //注册成为店主
    if (options && options.registerParams) {
      let registerParams = JSON.parse(decodeURIComponent(options.registerParams));
      console.log('店主注册逻辑=====', registerParams);
      options.url = `${this.data.newUrl}?type=${registerParams.type}&auth=${registerParams.auth}&isDebug`
    }
    //购物车--星际开卡
    else if (options && options.flag == "cart") {
      let url = `${customApp.globalData.h5Address}starCustomer`;
      let urlData = JSON.parse(decodeURIComponent(options.params));
      console.log('urlData=====', urlData);
      let assignObj: any = Object.assign(urlData, util.getCommonArguments());
      console.log('assignObj========', assignObj);
      options['url'] = url + `?params=${encodeURIComponent(JSON.stringify(assignObj))}`
    }
    //分享订单列表
    else if (options && options.flag == "shareOrderList") {
      //   let assignObj={
      //     token: null,
      //     nuskinToken:  null,
      //     userInfo: null,
      //     fromType: 'customer',
      //     channelId:12,
      //     sessionInfo: {
      //       openId: null,
      //       unionId: null,
      //     },
      //     shopkeeperId: wx.getStorageSync('shopInfo')?wx.getStorageSync('shopInfo').partner.nkMemberId:null,
      //     msShopId: wx.getStorageSync('shopInfo')?wx.getStorageSync('shopInfo').shop.id:null,
      //     orderId:options.orderId,
      //     title:options.title
      //   }
      wx.setStorageSync('shareKey', options.shareKey)
      wx.setStorageSync('shopId', options.shopId)
      // 先绑定上级分享人
      util.bindShareUser()
      let assignObj = Object.assign(util.getCommonArguments(), { orderId: options.orderId, title: options.title, shopId: options.shopId, tc: options.tc })
      console.log('options======shareorder', options);
      console.log('options======assignObj', assignObj);
      options.url = `${this.data.newUrl}?params=${encodeURIComponent(JSON.stringify(assignObj))}`;
      console.log('options======url', options.url);
      //搜索页面
    } else if (options && options.flag == "searchPage") {
      options.url = `${customApp.globalData.h5Address}searchPage?currentTime=${Date.parse(new Date().toString())}&params=${options.params}`;
    } else if (options && options.flag == "activation") {
      options.url = options.url + '?type=' + options.type;
    // }else if(options && options.flag == "bill"){
    //     let params = Object.assign({}, {
    //         orderIndex: this.data.options.orderIndex,
    //       }, util.getCommonArguments());
    //     options.url = `${customApp.globalData.h5Address}orderList?params=${encodeURIComponent(JSON.stringify(params))}`
    } else {
      //其他
      if (options.params) {
        console.log('params====', options.params);
        options.url = `${this.data.newUrl}?params=${options.params}`;
      }
    }
    console.log('最终的url=====', options.url);
    this.setData({
      webViewSrc: options.url,
    });
  },
  bindLoadHandler: function (e: any) {
    console.log('e========', e);
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
    util.getUrl();
    console.log('this.data.options.params==', this.data.options.flag);
    console.log('this.data.options.params==', this.data.options.params);

    util.checkLogin().then(() => {
      let time: any = Date.parse(new Date().toString())
      this.setData({
        time
      })
      let assignObj: any = '';
      let currentUrl: any = '';
      let splitUrl: any = '';
      if (this.data.options.params) {
        let showParams = JSON.parse(decodeURIComponent(this.data.options.params));
        console.log('1234567999999', showParams);
        if (this.data.pageType === "machineCode" || this.data.pageType === "evaluate") {
          util.request(api.getUserInfo).then((res: any) => {
            res.data.userProfile.avatar = null
            let userInfo = Object.assign(res.data.nuskinUserInfo, res.data.userProfile)
            wx.setStorageSync("userInfo", userInfo)
            let currentTime = wx.getStorageSync("currentTime")
            assignObj = Object.assign(showParams, { currentTime, keyword: this.data.keyword })
            assignObj.userInfo = userInfo
            console.log('machineCode========', assignObj);
            splitUrl = this.data.options.url.split('?')[0];
            currentUrl = `${splitUrl}&params=${encodeURIComponent(JSON.stringify(assignObj))}`;
            this.setData({
              webViewSrc: ''
            });
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/customerPage/index?url=' + currentUrl
              })
            }, 100);
          })
        }
        if (showParams.hasOwnProperty('nuskinToken') && showParams['nuskinToken'] == null && this.data.options.flag == "shareOrderList") {
          assignObj = Object.assign({ orderId: this.data.options.orderId, title: this.data.options.title, shopId: this.data.options.shopId, tc: this.data.options.tc }, util.getCommonArguments());
          splitUrl = this.data.options.url.split('?')[0];
          currentUrl = `${splitUrl}&params=${encodeURIComponent(JSON.stringify(assignObj))}`;
          this.setData({
            webViewSrc: ''
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/customerPage/index?url=' + currentUrl
            })
          }, 100);
        } else if (showParams.hasOwnProperty('nuskinToken') && showParams['nuskinToken'] == null && this.data.options.flag == "searchPage") {
          console.log('showParams111111=====', this.data.options);
          splitUrl = this.data.options.url.split('?')[0];
          currentUrl = `${splitUrl}&currentTime=${Date.parse(new Date().toString())}&params=${encodeURIComponent(JSON.stringify(util.getCommonArguments()))}`;
          this.setData({
            webViewSrc: ''
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/customerPage/index?url=' + currentUrl
            })
          }, 100);
        }else{
          console.log('showParams=====', showParams);
          assignObj = Object.assign(showParams, util.getCommonArguments());
          console.log('assignObj========', assignObj);
          splitUrl = this.data.options.url.split('?')[0];
          currentUrl = `${splitUrl}&currentTime=${Date.parse(new Date().toString())}&params=${encodeURIComponent(JSON.stringify(assignObj))}`;

          // this.setData({
          //     webViewSrc: ''
          //   });
          //   setTimeout(() => {
          //     wx.redirectTo({
          //         url:'/pages/customerPage/index?url='+currentUrl
          //     })
          //   }, 100);

        }
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
    // let pages= getCurrentPages();
    // if(pages.length==1){
    //     console.log('pages====',pages);
    //     wx.switchTab({
    //         url: '/pages/ucenter/index/index',
    //       })
    // }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

})