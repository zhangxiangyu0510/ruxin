// pages/loadingScreenPage/loadingScreenPage.ts
const loaddingApp = getApp<IAppOption>();
var util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    console.log('options',options)
    if (options.shopId || options.shareKey) {
      wx.setStorageSync('shopId', options.shopId)
      wx.setStorageSync('shareKey', options.shareKey)

      if (options.tc) {
        wx.setStorageSync('themeColor', options.tc)
        loaddingApp.globalData.themeColor = '#'+ options.tc
      wx.setStorageSync('themeColor', '#'+ options.tc);
        wx.switchTab({
          url: '/pages/index/index'
        })
      }else{
        util.getThemeColor({ shopId: options.shopId, openId: '' }).then((res: any) => {
          console.log('123456789', res);
       
          wx.setStorageSync('themeColor', res.data.primaryColor);
          loaddingApp.globalData.themeColor = res.data.primaryColor
          wx.switchTab({
            url: '/pages/index/index'
          })

        }).catch(() => {
          wx.setStorageSync('themeColor', '#7340B3');
          loaddingApp.globalData.themeColor = '#7340B3'
          wx.switchTab({
            url: '/pages/index/index'
          })
        })
      }
 
    } else {

      if (wx.getStorageSync('themeColor')) {
        loaddingApp.globalData.themeColor = wx.getStorageSync('themeColor')
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
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

  /**
   * 用户点击右上角分享
   */

})