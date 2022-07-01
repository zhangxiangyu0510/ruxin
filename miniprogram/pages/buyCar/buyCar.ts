// pages/customerPage/index.ts
const carApp = getApp<IAppOption>()
// var changeSvg = require('../../utils/changeThemeColor');
var api = require('../../config/api')
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc: '',
    agreementsObj:{},
    params:{
      token:'',
      nuskinToken:'',
      fromType:'customer',
      userInfo:'',
      sessionInfo:{
        openId:'', 
        unionId:''
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
   
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
    // wx.setTabBarBadge({
    //     index: 2,
    //     text: '3'
    // })
    util.getUrl();
      this.setData({
        webViewSrc:carApp.globalData.h5Address+'cart'+'?currentTime='+Date.parse(new Date().toString())+'&params='+encodeURIComponent(JSON.stringify(util.getCommonArguments())),
    });
    // let paramsResult='';
    // util.checkLogin().then(() => {
    //   this.setData({
    //     'params.token':wx.getStorageSync("nuskinToken"),
    //     'params.nuskinToken':wx.getStorageSync('access_token'),
    //     'params.userInfo':wx.getStorageSync('userInfo'),
    //     'params.sessionInfo.openId':wx.getStorageSync("openId"),
    //     'params.sessionInfo.unionid':wx.getStorageSync('unionId')
    //   })
    //   paramsResult=encodeURIComponent(JSON.stringify(this.data.params))
    //   this.setData({
    //     webViewSrc:this.data.Url+'?currentTime='+Date.parse(new Date().toString())+'&params='+paramsResult,
    // });
    // }).catch(() => {
    //   this.setData({
    //     // 'params.time':Date.parse(new Date().toString()),
    //     'params.token':null,
    //     'params.nuskinToken':null,
    //     'params.userInfo':null,
    //     'params.sessionInfo':null,
    //   });
    //   paramsResult=encodeURIComponent(JSON.stringify(this.data.params))
    //   this.setData({
    //     webViewSrc:this.data.Url+'?currentTime='+Date.parse(new Date().toString())+'&params='+paramsResult,
    // });
    // console.log('url====',this.data.webViewSrc);
    // });
  
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