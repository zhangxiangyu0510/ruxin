// pages/orderPage/index.ts
const orderApp = getApp<IAppOption>();
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    console.log('参数======', options);
    if (options.flag=='bill') {
        let currentParams=JSON.parse(decodeURIComponent(options.params));
        console.log('currentParams',currentParams);
        this.setData({
            webViewSrc: orderApp.globalData.customerH5+'/shop/orderInvoice?token='+ wx.getStorageSync('access_token') +'&type='+currentParams.type+'&orderId='+ currentParams.orderId +'&orderNo='+ currentParams.orderNo +'&packNo='+ currentParams.packNo+'&flag='+currentParams.flag+'&orderIndex='+currentParams.orderIndex+'&miniProgramSource='+currentParams.miniProgramSource
        }); 
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