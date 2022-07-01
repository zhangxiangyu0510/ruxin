// pages/my/my.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
const ucenterApp = getApp<IAppOption>()
import { svgColor } from "../../../utils/changeThemeColor";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg: "",
    status: [
      { name: '待付款', orderCount: 0, urlIcon: ucenterApp.globalData.imageUrl + "/userCenter/pending-payment.svg" },
      { name: '已支付', orderCount: 0, urlIcon: ucenterApp.globalData.imageUrl + "/userCenter/Paid.svg" },
      { name: '待捡配', orderCount: 0, urlIcon: ucenterApp.globalData.imageUrl + "/userCenter/picked.svg" },
      { name: '已完成', orderCount: 0, urlIcon: ucenterApp.globalData.imageUrl + "/userCenter/completed.svg" }
    ],
    imageUrl: ucenterApp.globalData.imageUrl,
    header_img: ucenterApp.globalData.imageUrl + "/icons/mine_header.svg",
    my_header_avater: ucenterApp.globalData.imageUrl + "/icons/defaultMyIcon.svg",
    svg1: ucenterApp.globalData.imageUrl + "/icons/top.svg",
    svg2: ucenterApp.globalData.imageUrl + "/icons/star_btn.svg",
    userInfo: {
      avatar: '',
      nickname: '',
      identityTag: '',
      mobile: '',
      cnCardNo: ''
    },
    nuskinUserInfo: {},
    hasUserInfo: false,
    enNumber: 0,
    identityTagIcon1: '',
    identityTagIcon2: '',
    identityTagData: {
      "0": {
        text: '注册顾客',
        value: 1
      },
      "1": {
        text: '零售顾客',
        value: 1
      },
      "2": {
        text: '零售顾客',
        value: 2
      },
      "3": {
        text: '星级顾客',
        value: 3
      }
    },
    themeColor: ucenterApp.globalData.themeColor
  },
  editInfo() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/packageOne/pages/userInfo/userInfo?state=editInfo'
      })
    } else {
      this.goLoginPage()
    }
  },
  jumpCustormDetail() {
    wx.navigateTo({
      url: '/pages/customerLabelingProcess/custormDetail/custormDetail'
    })
  },
  goOwner() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/packageOne/pages/userInfo/userInfo?state=seeDetail'
      })
    } else {
      this.goLoginPage()
    }
  },
  goLoginPage() {
    util.getUserProfile()
  },
  enterFeedback() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/packageOne/pages/feedbackComplaints/feedbackComplaints'
      })
    } else {
      this.goLoginPage()
    }
  },
  getUserInfo() {
    let that = this
    util.request(api.getUserInfo).then((res: any) => {
      if (res && res.data.user) {
        wx.setStorageSync('userInfo', Object.assign({}, res.data.user, res.data.userProfile, res.data.nuskinUserInfo));
      }
      let resData = res.data;
      let userInfo = {
        avatar: '',
        nickname: '',
        identityTag: '',
        mobile: '',
        cnCardNo: ''
      }
      userInfo.avatar = resData.userProfile && resData.userProfile.avatar
      userInfo.nickname = resData.userProfile && resData.userProfile.nickname
      userInfo.mobile = resData.user && resData.user.mobile
      userInfo.cnCardNo = resData.user && resData.user.cnCardNo
      let identityTagIcon1 = '',
        identityTagIcon2 = '';
      if (resData.nuskinUserInfo.type === 1) {
        identityTagIcon1 = ucenterApp.globalData.imageUrl + '/icons/customer_star3.svg',
          identityTagIcon2 = ucenterApp.globalData.imageUrl + '/icons/star_box3.svg'
        userInfo.identityTag = "0"
      } else {
        if (resData.nuskinUserInfo.level === 1) {
          identityTagIcon1 = ucenterApp.globalData.imageUrl + '/icons/customer_star2.svg',
            identityTagIcon2 = ucenterApp.globalData.imageUrl + '/icons/star_box2.svg'
          userInfo.identityTag = "1"
        } else if (resData.nuskinUserInfo.level === 2) {
          identityTagIcon1 = ucenterApp.globalData.imageUrl + '/icons/customer_star2.svg',
            identityTagIcon2 = ucenterApp.globalData.imageUrl + '/icons/star_box2.svg'
          userInfo.identityTag = "2"
        } else if (resData.nuskinUserInfo.level === 3) {
          util.svgColor(ucenterApp.globalData.imageUrl + '/icons/customer_star.svg', ucenterApp.globalData.themeColor).then((res: any) => {
            this.setData({ identityTagIcon1: 'data:image/svg+xml,' + res })
          })
          util.svgColor(ucenterApp.globalData.imageUrl + '/icons/star_box.svg', ucenterApp.globalData.themeColor).then((res: any) => {
            this.setData({ identityTagIcon2: 'data:image/svg+xml,' + res })
          })
          userInfo.identityTag = "3"
        }
      }
      this.setData({
        identityTagIcon1,
        identityTagIcon2,
        userInfo,
        hasUserInfo: true,
        nuskinUserInfo: resData.nuskinUserInfo
      })
    }).catch(() => {
      that.setData({
        hasUserInfo: false
      })
      this.goLoginPage()
    })
  },
  getSelfEnNumber() {
    let that = this
    util.request(api.getSelfEnNumber).then((res: any) => {
      if (res) {
        that.setData({
          enNumber: res.data[0].availableTotalVirtualCoin
        })
      }
    })
  },
  getOrderStatusCount() {
    let that = this
    util.request(api.getOrderStatusCount).then((res: any) => {
      if (res && res.data) {
        that.data.status.forEach((item: any) => {
          if (item.name == '待付款') {
            item.orderCount = res.data.preOrderCount
          } else if (item.name == '已支付') {
            item.orderCount = res.data.payOrderCount
          } else if (item.name == '待捡配') {
            item.orderCount = res.data.postOrderCount
          } else {
            item.orderCount = 0
          }
        })
        that.setData({
          status: that.data.status
        })
      }
    }).catch((res: any) => {
      console.log(res);

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
    // util.getThemeColor().then((res:any)=>{
    //     console.log('9999999======',res);
    // if(res){
    // let themeIcon: string = svgColor(this.data.my_header_avater, wx.getStorageSync('themeColor'), "stroke")
    this.setData({
      // my_header_avater: themeIcon,
      // svg1: changeColor.svgColor(this.data.svg1, wx.getStorageSync('themeColor')),
      // svg2: svgColor(this.data.svg2, wx.getStorageSync('themeColor')),
      // header_img: svgColor(this.data.header_img, wx.getStorageSync('themeColor')),
      themeColor: ucenterApp.globalData.themeColor,
      bg: wx.getStorageSync('indexBg')
    })
    this.changeColor('svg1', this.data.svg1, wx.getStorageSync('themeColor'));
    this.changeColor('svg2', this.data.svg2, wx.getStorageSync('themeColor'));
    this.changeColor('header_img', this.data.header_img, wx.getStorageSync('themeColor'));
    this.changeColor('my_header_avater', this.data.my_header_avater, wx.getStorageSync('themeColor'), "stroke");

    // }
    // })
    util.checkLogin().then(() => {
      this.setData({
        hasUserInfo: true
      })
      this.getH5Token()
      this.getOrderStatusCount()
      this.getUserInfo()
      this.getSelfEnNumber()
    }).catch(() => {
      this.setData({
        hasUserInfo: false
      })
    })
    util.getUrl();
    this.selectComponent("#dialogProtocol").close();
  },
  getH5Token() {
    util.request(api.getH5Token).then(function (res: any) {
      if (res && res.data) {
        console.log('shar_key====', res.data);
        wx.setStorageSync("access_token", res.data.nuskinToken);
      }
    });
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
  //公共参数获取
  getCommonArguments() {
    let params = {
      token: wx.getStorageSync("nuskinToken"),
      nuskinToken: wx.getStorageSync('access_token'),
      userInfo: wx.getStorageSync('userInfo'),
      shareKeyOther: wx.getStorageSync('shareKey'),
      sessionInfo: {
        openId: wx.getStorageSync("openId"),
        unionId: wx.getStorageSync('unionId'),
      },
      fromType: 'customer',
      channelId: 12,
      shopkeeperId: wx.getStorageSync('shopInfo').partner.nkMemberId,
      msShopId: wx.getStorageSync('shopInfo').shop.id,
      shopName: wx.getStorageSync('shopInfo').shop.name

    }
    if (wx.getStorageSync('userInfo')) {
      params.userInfo.avatar = null;
    }
    return params;
  },
  //优惠券
  myCoupons() {
    // var accountId='1303805912041057290';
    let newParams: any = this.getCommonArguments();

    newParams['accountId'] = wx.getStorageSync('userInfo').nkMemberId;
    util.checkLogin().then(() => {
      wx.navigateTo({
        url: `/pages/customerPage/index?url=${ucenterApp.globalData.h5Address}coupon&params=${encodeURIComponent(JSON.stringify(newParams))}`
      })
    }).catch(() => {
      util.getUserProfile();
    })
  },
  becomeStar() {
    util.checkLogin().then(() => {
      wx.navigateTo({
        url: `/pages/customerPage/index?url=${ucenterApp.globalData.h5Address}starCustomer&params=${encodeURIComponent(JSON.stringify(this.getCommonArguments()))}`
      })
    }).catch(() => {
      util.getUserProfile();
    })
  },
  goEnhome() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: `/pages/enHome/index?url=${ucenterApp.globalData.customerH5}/shop/productPoints`
      })
    } else {
      this.goLoginPage()
    }
  },
  myOrder(e: any) {
    console.log('下标====', e.currentTarget.dataset.orderindex);
    util.checkLogin().then(() => {
      let params = Object.assign({}, {
        orderIndex: e.currentTarget.dataset.orderindex,
      }, this.getCommonArguments())
      wx.navigateTo({
        url: `/pages/customerPage/index?url=${ucenterApp.globalData.h5Address}orderList&params=${encodeURIComponent(JSON.stringify(params))}`
      })
    }).catch(() => {
      util.getUserProfile();
    })
  },
  goShopkeeperLevel() {
    wx.navigateTo({
      url: '/packageUser/pages/mylevel/mylevel',
    })
  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    util.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },
  goMyNucoin() {
    wx.navigateTo({
      url: '../../NUcoin/myNUcoin/myNUcoin',
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  //地址
  goAddress() {
    util.checkLogin().then(() => {
      wx.navigateTo({
        url: `/pages/customerPage/index?url=${ucenterApp.globalData.h5Address}address&params=${encodeURIComponent(JSON.stringify(this.getCommonArguments()))}`
      })
    }).catch(() => {
      util.getUserProfile();
    })
  },
  //发票管理
  goBill() {
    util.checkLogin().then(() => {
      wx.navigateTo({
        url: `/pages/customerPage/index?url=${ucenterApp.globalData.h5Address}bill&params=${encodeURIComponent(JSON.stringify(this.getCommonArguments()))}`
      })
    }).catch(() => {
      util.getUserProfile();
    })
  }

})