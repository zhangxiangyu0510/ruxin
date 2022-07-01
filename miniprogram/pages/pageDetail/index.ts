// pages/customerPage/index.ts
const detailApp = getApp<IAppOption>();
var util = require('../../utils/util');
var api = require('../../config/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc: '',
    haveInfo: true,
    url: `${detailApp.globalData.h5Address}productDetail`,
    options: {},
    shareParams: { catalogId: "" },
    goodListOption: '',
    pageType: '',
    keyword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    let url = `${detailApp.globalData.h5Address}productDetail`;
    console.log('data.options=====', options);
    options.shareKey ? wx.setStorageSync('shareKey', options.shareKey) : ''
    options.shopId ? wx.setStorageSync('shopId', options.shopId) : ''
    // 绑定上级分享人
    util.bindShareUser()
    console.log('我是分享进来的shareKey', options.shareKey)
    console.log('我是分享进来的店铺', options.shopId)
    if (options.shareParams) {
      let _shareParams = options.shareParams.split(',')
      _shareParams[3] ? wx.setStorageSync('shopId', _shareParams[3]) : ''
      util.getShopInfo(_shareParams[3])
      let addAgruments = {
        catalogId: _shareParams[0],
        itemId: _shareParams[1],
        itemType: _shareParams[2],
        fromType: 'customer',
        channelId: 12,
        shareKey: options.shareKey
      };
      let params = Object.assign(util.getCommonArguments(), addAgruments);
      options.params = encodeURIComponent(JSON.stringify(params))
      util.checkLogin().then(() => {
      }).catch(() => {
        this.setData({
          shareParams: addAgruments
        })
      });
      options.flag = "cart"
    }
    if (options.url) {
      wx.setStorageSync('initRoute', options.url);
    }
    if (options.params) {
      if (options.flag == "cart") {
        let urlData = JSON.parse(decodeURIComponent(options.params));
        let assignObj = Object.assign(util.getCommonArguments(), urlData);
        options['url'] = url + `?params=${encodeURIComponent(JSON.stringify(assignObj))}`
        this.setData({
          options: encodeURIComponent(JSON.stringify(assignObj))
        })
        console.log('最终的url======', options.url);
      } else if (JSON.parse(decodeURIComponent(options.params)).flag == "goodList") {
        let goodListObj = Object.assign(util.getCommonArguments(), JSON.parse(decodeURIComponent(options.params)))
        options['url'] = url + `?params=${encodeURIComponent(JSON.stringify(goodListObj))}`;
        this.setData({
          options: encodeURIComponent(JSON.stringify(goodListObj))
        })
      } else {
        options.url += '?params=' + options.params;
        this.setData({
          options: options.params
        })
      }
    }
    console.log('options.url', options.url)
    let after_hash = true //选填项 默认 false
    this.setData({
      webViewSrc: getApp().sensors.setWebViewUrl(options.url, after_hash)
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
    console.log('进入了======');
    util.checkLogin().then(() => {
      let assignObj: any = '';
      let currentUrl: any = '';
      let showParams: any = JSON.parse(decodeURIComponent(this.data.options));
      if (this.data.pageType === "machineCode" || this.data.pageType === "evaluate") {
        util.request(api.getUserInfo).then((res: any) => {
            res.data.userProfile.avatar = null
          let userInfo = Object.assign(res.data.nuskinUserInfo, res.data.userProfile)
          wx.setStorageSync("userInfo", userInfo)
          let currentTime = wx.getStorageSync("currentTime")
          assignObj = Object.assign(showParams, { currentTime, keyword: this.data.keyword, userInfo: userInfo })
          assignObj.userInfo = userInfo
          console.log('machineCode========', assignObj);
          assignObj = Object.assign(showParams, util.getCommonArguments());
          currentUrl = `${this.data.url}&params=${encodeURIComponent(JSON.stringify(assignObj))}`;
          this.setData({
            webViewSrc: currentUrl
          });
        })
        return
      }
      console.log('1234567', showParams);
      if (this.data.shareParams.catalogId || (showParams.hasOwnProperty('nuskinToken') && showParams['nuskinToken'] == null) || (showParams.hasOwnProperty('nuskinToken') && showParams['nuskinToken'] == null && showParams['flag'] == "goodList")) {
        console.log('showParams=====', showParams);
        //刷新参数--先不考虑购物车进来的逻辑
        assignObj = Object.assign(showParams, util.getCommonArguments());
        console.log('assignObj========', assignObj);
        currentUrl = `${this.data.url}&params=${encodeURIComponent(JSON.stringify(assignObj))}`;
        // console.log('我还是进来了')
        // console.log('我还是进来了currentUrl',currentUrl)
        // let after_hash = true //选填项 默认 false
        // this.setData({
        //     webViewSrc: ''
        //   });
        //   setTimeout(() => {
        //     this.setData({
        //         webViewSrc: getApp().sensors.setWebViewUrl(currentUrl, after_hash)
        //     })
        //   }, 100);
        this.setData({
          webViewSrc: ''
        });
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/pageDetail/index?url=' + currentUrl
          })
        }, 100);

      }
    }).catch(() => {
      this.setData({
        haveInfo: false
      })
    })
    // 分享
    // util.checkLogin().then(() => {
    //   let showParams = JSON.parse(decodeURIComponent(this.data.options.params));
    //   if (this.data.shareParams.catalogId && showParams['nuskinToken'] === null) {
    //     let assignObj = Object.assign(showParams,util.getCommonArguments());
    //     console.log('assignObj========', assignObj);
    //     let currentUrl = `${this.data.url}?params=${encodeURIComponent(JSON.stringify(assignObj))}`;
    //     // console.log('我还是进来了2')
    //     // console.log('我还是进来了currentUrl',currentUrl)
    //     let after_hash = true //选填项 默认 false
    //     this.setData({
    //         webViewSrc: getApp().sensors.setWebViewUrl(currentUrl, after_hash)
    //     });
    //   }
    // })
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