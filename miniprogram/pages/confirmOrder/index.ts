// pages/customerPage/index.ts
const confirmApp = getApp<IAppOption>();
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    let url=`${confirmApp.globalData.h5Address}confirmOrder`;
    console.log('options=====',options);
    if (options.url) {
      wx.setStorageSync('initRoute', options.url);
    } 
    if(options.params){
        console.log('params====',options.params);
        let urlData = JSON.parse(decodeURIComponent(options.params));
        let assignObj=Object.assign({},urlData,util.getCommonArguments());
        options['url'] =url+`?params=${encodeURIComponent(JSON.stringify(assignObj))}`
        this.setData({
          webViewSrc:options.url,
      });
    }
  },
    //公共参数获取
    getCommonArguments(){
      let params={
        token:wx.getStorageSync("nuskinToken"),
        nuskinToken:wx.getStorageSync('access_token'),
        userInfo:wx.getStorageSync('userInfo'),
        sessionInfo:{
          openId:wx.getStorageSync("openId"),
          unionId:wx.getStorageSync('unionId'),
        },
        fromType:'customer'
      }
      return params;
    },
  bindLoadHandler: function (e:any) {
    console.log('e========',e);
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