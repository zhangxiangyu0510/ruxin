// components/commonGlobal/commonGlobal.ts
var api = require('../../config/api')
var util = require('../../utils/util');
var changeHeaderSvg: any = require('../../utils/changeThemeColor');
let commmonApp = getApp<IAppOption>();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopId: {
      type: String
    },
    payDialog:{
        type:Boolean,
        value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    NeoanthropicDialogShow: false,
    themeColor:commmonApp.globalData.themeColor,
    payLogo:commmonApp.globalData.imageUrl+'/icons/payFocus.svg'

  },
  lifetimes: {
    ready() {
      if (!wx.getStorageSync("shopInfo")) {
        this.getShopInfo(wx.getStorageSync('shopId'))
      }
    }
  },
  pageLifetimes: {
    show() {
        this.setData({
            themeColor:wx.getStorageSync('themeColor'),
        });
        this.changeColor('payLogo',commmonApp.globalData.imageUrl+'/icons/payFocus.svg', wx.getStorageSync('themeColor'))
      if (!wx.getStorageSync("shopInfo")) {
        this.getShopInfo(wx.getStorageSync('shopId'))
      }
      util.checkLogin().then(() => {
        let value = wx.getStorageSync('Neoanthropic')
        if (value == 1) {
          return
        }
        this.getGuideRecommendation()
      })
    
      if (wx.getStorageSync('cookie')) {
        this.getUserInfo()
      }


      let that = this
      wx.login({
        success: res => {
          util.request(api.getToken + '?code=' + res.code).then(function (res: any) {
            if (res && res.data) {
              let shopId = wx.getStorageSync("shopId")
              // 未登录获取shopid
              if (!that.data.shopId) {
                if (!shopId) {
                  util.request(api.getLastShopId, { open_id: res.data.openId }).then((ress: any) => {
                    if (ress.data==='closeShop') {
                      that.noData()
                      return
                    }
                    wx.setStorageSync("shopId", ress.data)
                   
                  })
                } else {
                  util.request(api.getLastBrowseShop, { openId: res.data.openId, shopId }, "POST").then((v: any) => {
                    console.log(v);
                  })
                    util.request(api.getShopInfo, { shop_id: shopId }, 'get').then(function (res: any) {
                        console.log(res,"bbbbbbbbbbbbbbbbbbbbbbbbbbbb");
                        if (!res.data.shop) {
                            that.noData()
                        }
                    })
                }
              }
              console.log('222222',shopId)
              util.getThemeColor({shopId,openId:res.data.openId}).then((res1: any) => {
                console.log(res1)
                wx.setStorageSync('themeColor', res1.data.primaryColor);
                commmonApp.globalData.themeColor = res1.data.primaryColor
                util.checkLogin().then(() => {
                  let value = wx.getStorageSync('Neoanthropic')
                  if (value == 1) {
                    return
                  }
                 
                })
        
              })
              // 登录提交shopid
              util.checkLogin().then(() => {
                if (!shopId) {
                  let shopInfo = wx.getStorageSync("shopInfo")
                  if (!shopInfo && shopInfo.shop && shopInfo.shop.id) {
                    that.noData()
                  }
                }
              }).catch(() => {
                console.log('我没登录了');
              });
            }
          });
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog(){
        this.setData({
            payDialog:false,
        });
        this.triggerEvent('payDialogevent');
        wx.getStorageSync('paySuccess')&&wx.removeStorageSync("paySuccess");
    },
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      util.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })
  
  
    },
    isHasShopRegister() {
        let that=this;
      let params: any = {
        type: 'miniProgram',
        auth: wx.getStorageSync('access_token')
      }
      console.log('9999999', wx.getStorageSync('userInfo'));
      let currentApi = api.getStoreRegistration + '?cnCard=' + wx.getStorageSync('userInfo').cnCardNo
      util.request(currentApi).then((res: any) => {
        if (res.data.checkOpenShop==1) {
                wx.navigateTo({
                    url: `/pages/customerPage/index?url=${commmonApp.globalData.customerH5}/shop/applyForShopkeeper&registerParams=${encodeURIComponent(JSON.stringify(params))}`
                  })
        }
      }).catch((err: any) => {
        console.log(err);
      })
    },
    isApplyShopkeeper(){
        let currentApi = api.getRegisterShopkeeper + '?memberId=' + wx.getStorageSync('userInfo').nkMemberId
        util.request(currentApi).then((res: any) => {
            if(res.data.checkShopInfo==1){
                wx.navigateToMiniProgram({
                    appId: commmonApp.globalData.shopKeeperAppId,
                    path: 'pages/index/index',
                    extraData: {
                        foo: 'bar'
                    },
                    envVersion: 'trial',
                    success(res) {
                    }
                });
                wx.getStorageSync("token")&&wx.removeStorageSync("token");
                wx.getStorageSync("openId")&&wx.removeStorageSync("openId");
                wx.getStorageSync("userInfo")&&wx.removeStorageSync("userInfo");
                wx.getStorageSync("shopInfo")&&wx.removeStorageSync("shopInfo");
                wx.getStorageSync("cookie")&&wx.removeStorageSync("cookie");
                wx.getStorageSync("permisssion")&&wx.removeStorageSync("permisssion");
                wx.getStorageSync("access_token")&&wx.removeStorageSync("access_token");
                wx.getStorageSync("nuskinToken")&&wx.removeStorageSync("nuskinToken");
                wx.getStorageSync("Neoanthropic")&&wx.removeStorageSync("Neoanthropic");
            }
        })

    },
    getUserInfo() {
      let that = this
      util.request(api.getUserInfo).then((res:any) => {
        this.triggerEvent("userInfo",res.data)
        
        //注册店铺
        this.isHasShopRegister();
        //是否申请
        this.isApplyShopkeeper();
      }).catch(() => {
        that.setData({
          hasUserInfo: false,
        });
      })
    },
    // 获取店铺信息
    getShopInfo(shopId: any) {
      let that = this
      util.request(api.getShopInfo, { shop_id: shopId }, 'get').then(function (res: any) {
        if (res && res.data.shop) {
          res.data.shop.id&&wx.setStorageSync('shopInfo', res.data)
        }
      });

    },
    // 查询是否需要开启NU店之旅
    getGuideRecommendation() {
      let userInfo = wx.getStorageSync('userInfo')
      let _data = {
        type: 4,
        user_id: userInfo.id
      }
      // util.request(api.noviceGuideRecommendation, _data).then((res: any) => {
      // if (res.data) {
      this.setData({
        NeoanthropicDialogShow: true
      })
      wx.hideTabBar({});
      // } else {
      // wx.setStorageSync('Neoanthropic', 1)
      // }

      // }).catch((err: any) => {
      //   console.log(err);
      // })
    },
    // 关闭NU店之旅
    closePosters() {
      let that = this;
      let _userInfo = wx.getStorageSync('userInfo')
      let _data = {
        // noviceGuideDto: {
        type: 4,
        userId: _userInfo.id
        // }
      }
      util.request(api.noviceGuideDone, _data, 'post').then((res: any) => {

      }).catch((err: any) => {
        console.log(err);
      })
      wx.setStorageSync('Neoanthropic', 1)
      this.setData({
        NeoanthropicDialogShow: false
      })
      wx.showTabBar({});

    },
    // 无shopId或者未关注店铺走缺省页
    noData() {
      wx.reLaunch({
        url: "/packageOne/pages/noData/noData"
      })
    }
  }
})
