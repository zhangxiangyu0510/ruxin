// pages/ucenter/myBadge/myBadge.ts
import {svgColor} from "../../../utils/changeThemeColor";
var api = require('../../../config/api');
var util = require('../../../utils/util');
let componentApp = getApp<IAppOption>();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    badgeData: [],
    shopInfo:{},
    imageUrl:componentApp.globalData.imageUrl,
    my_header_avater: componentApp.globalData.imageUrl+"/icons/defaultMyIcon.svg",
    themeColor:wx.getStorageSync("themeColor"),
    levelImg:wx.getStorageSync("levelImg")
  },
  
  goBadgeDetail(e:any){
    console.log(e);
    let item = e.currentTarget.dataset.item
    wx.setStorageSync("badgeDetail",item)
    wx.navigateTo({
      url:`/packageOne/pages/badgeDetail/badgeDetail`
    })
  },
  getAllBadgeData(){
    util.request(api.getAllBadge,{shop_id:wx.getStorageSync('shopId')}).then((res:any)=>{
        let filterData = res.data.length&&res.data.filter((item:any)=>{
            item.badges =  item.badges.length&&item.badges.filter((v:any)=>{
                if(v.lighting) return v
            })||[]
            if(item.badges.length) return item
        })||[]
        this.setData({
            badgeData:filterData
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
        levelImg:wx.getStorageSync("levelImg")
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    util.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })
  },
  onShow() {
    this.getAllBadgeData()
    this.changeColor('my_header_avater',this.data.my_header_avater,wx.getStorageSync('themeColor'), "stroke")
    let shopInfo = wx.getStorageSync("shopInfo")
    shopInfo.shopAge = shopInfo.shop && shopInfo.shop.startTime ? util.timeTmp(shopInfo.shop.startTime) : '0'
    this.setData({
        shopInfo:Object.assign(shopInfo,shopInfo.partner, shopInfo.partnerProfile)
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