// pages/ucenter/badgeDetail/badgeDetail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    badgeDetailData:{},
    themeColor:wx.getStorageSync("themeColor"),
    badgeProcessData:[
      {
        onWidth:'100%',
        onLevel:1
      },
      {
        onWidth:'100%',
        onLevel:2
      },
      {
        onWidth:'100%',
        onLevel:3
      },
      {
        onWidth:'50%',
        onLevel:4
      },
      {
        onLevel:5
      },
      {
        onLevel:6
      }
    ]
  },
  handleLevel(e:any){
    let level = e.currentTarget.dataset.level
    console.log(level,e,1234);
    
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
    wx.setNavigationBarTitle({
        title:wx.getStorageSync("badgeDetail").name
    })
    this.setData({
        badgeDetailData:wx.getStorageSync("badgeDetail")
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