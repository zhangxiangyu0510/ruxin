// pages/customer/search/search.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyData:[
      {name:'水乳套装'},
      {name:'抗衰老'},
    ],
    hotData:[
      {name:'水乳套装'},
      {name:'氨基酸'},
      {name:'抗衰老'},
      {name:'洁面'},
    ]
  },
  goSearchResult(){
     wx.navigateTo({
      url: '../searchResult/searchResult',
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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

  }
})