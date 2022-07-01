// miniprogram/pages/ucenter/userInfo/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      themeColor:wx.getStorageSync("themeColor"),
      webViewSrc:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options:any) {
      console.log('进来了',options);
      
      if (options.url) {
        options.url = decodeURIComponent(options.url);
        wx.setStorageSync('initRoute', options.url);
        this.setData({
            webViewSrc: options.url+'?token='+ wx.getStorageSync('access_token') +'&type=miniProgram&userType=2&deviceId='+ wx.getStorageSync('unionId') +'&shareKey='+ wx.getStorageSync('shareKey') +'&flag=home'
        });
      }
    },
    bindLoadHandler: function (e:any) {
      console.log(e);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
  
    },
  
   
  })