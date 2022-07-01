// pages/shareInterim/shareInterim.ts
const app = getApp<IAppOption>()
var changeSvg = require('../../../utils/changeThemeColor');
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({
  onShareAppMessage() {
    // 分享
    // let _userInfo = wx.getStorageSync('userInfo')
    // let _shareKey = wx.getStorageSync('shareOptions').shareKey
    let shopId = this.data.shopId
    setTimeout(() => {
      this.setData({
        isShare: true,
      })
    }, 2000);
    let title = ''
    let _imageUrl = ''
    let _path = ''
    // 组合商品分享
    if (this.data.goodsId) {
      let _id = this.data.detailFrom.id || this.data.detailFrom.officialRecommendationId
      this.data.detailFrom.image.includes('http') ? '' : this.data.detailFrom.image = 'https:' + this.data.detailFrom.image
      title = this.data.detailFrom.title
      _imageUrl = this.data.detailFrom.image
      _path = `/packageOne/pages/productDetail/productDetail?shopId=${shopId}&id=${_id}&isOfficial=${this.data.detailFrom.isOfficial}&shareKey=${this.data.shareKey}&tc=${this.data.options.tc}`
      // h5详情的分享
    } else if (this.data.haShareData.length) {
      title = this.data.haShareData[4]
      _imageUrl = this.data.haShareData[3]
      let _params = this.data.haShareData[0] + "," + this.data.haShareData[1] + ',' + this.data.haShareData[2] + ',' + shopId
      _path = `/pages/pageDetail/index?shareKey=${this.data.shareKey}&shareParams=${_params}&tc=${this.data.options.tc}`
      // 店铺分享
    } else {
      title = this.data.shopInfo.partnerProfile && this.data.shopInfo.partnerProfile.nickname + '的如新NU店'
      _imageUrl = 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/c3c835a1-2c3e-4a84-9262-02cde140f4fc.png',
        _path = `/pages/loadingPage/loadingPage?shopId=${shopId}&shareKey=${this.data.shareKey}&tc=${this.data.options.tc}`
    }
    console.log('我是分享过渡页的_path',_path)

    const promise = new Promise(resolve => {
      resolve({
        title: title,
        path: _path,
        imageUrl: _imageUrl,
      })
    })
    return {
      title: title,
      path: _path,
      imageUrl: _imageUrl,
      promise
    }
  },
  // goBack() {
  //   wx.navigateToMiniProgram({
  //     appId: 'wxc0e6a1cbe908790b',
  //     path: 'pages/index/index?id=123',
  //     // path: ' packageOne/pages/shareInterim/shareInterim?id=123',
  //     extraData: {
  //       foo: 'bar'
  //     },
  //     envVersion: 'develop',
  //     success(res) {
  //       // 打开成功
  //     }
  //   })

  // },
  /**
   * 页面的初始数据
   */
  data: {
    shareKey: '',
    isShare: false,
    shopId: '',
    goodsId: '',
    detailFrom: {},
    shopInfo: {},
    options: {},
    haShareData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    console.log('我是分享过渡页的参数',options)
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    // wx.setStorageSync('shopId', options.shopId)
    // wx.setStorageSync('shareOptions', options)
    this.setData({
      shareKey: options.shareKey,
      shopId: options.shopId,
      goodsId: options.id,
      options: options
    })
    this.getShopInfo(options.shopId)
    if (options.id) {
      this.getProductDetail(options)
    }
    if (options.h5Share || options.h5share) {
      let _h5Share=options.h5Share || options.h5share
      this.setData({
        haShareData:_h5Share.split(',')
      })
    }

  },
  // 获取店铺信息
  getShopInfo(shopId: any) {
    let _that = this
    // util.showOtherToast('开始请求', "loading");
    // wx.hideToast();
    // wx.showModal({
    //   title: '提示',
    //   content: api.getShopInfo+'/'+ shopId,
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // });
    util.request(api.getShopInfo, { shop_id: shopId }, 'get').then(function (res: any) {
      _that.setData({
        shopInfo: res.data
      })
      // wx.hideToast();
      // util.showOtherToast(res.data.shop.name, "loading");

    }).catch((err) => {
      // wx.hideToast();
      // util.showOtherToast('请求失败', "loading");
      // util.showOtherToast(err, "loading");

    })
  },
  // 获取商品信息
  getProductDetail(options: any) {
    let that = this
    util.request(api.optimizationDetail + options.id, {
      isOfficial: options.isOfficial
    }, 'get').then(function (res: any) {
      console.log('详情', res);
      if(res.data.shopProductItemList.length==1){
        res.data.image=res.data.shopProductItemList[0].image
      }
      that.setData({
        detailFrom: res.data
      })
    });
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

    // let _shopId = wx.getStorageSync('shopId')
    // console.log('onShow', '_shopId', _shopId)
    // setTimeout(() => {
    //   this.getShopInfo(_shopId)
    // }, 2000);
    // let _shareOptions = wx.getStorageSync('shareOptions')
    // if (_shareOptions.id) {
    //   this.getProductDetail(_shareOptions)
    // }

    // if(isShare){

    // }

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


  /**
   * 用户点击右上角分享
   */

})