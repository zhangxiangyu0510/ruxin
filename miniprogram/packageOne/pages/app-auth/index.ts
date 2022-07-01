// pages/app-auth/app-auth.ts
let appLogin = getApp<IAppOption>();
var api = require('../../../config/api')
var util = require('../../../utils/util');
var changeSvg = require('../../../utils/changeThemeColor');
import imClient from "../../../utils/imClient";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // showPhone:true,
    showPhoneDialog1: false,
    showPhoneDialog2: false,
    showSingleStop: false,
    errorText: '',
    checked: false,
    protocol: [],
    isNewUser: '',
    logo1: 'packageOne/images/icons/logo.svg',
    submitAccess:true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    console.log('地址上过来的数据', options);
    if (options.isNewUser) {
      console.log('11111');
      this.setData({
        isNewUser: options.isNewUser
      })

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
    this.setData({
      logo1: changeSvg.svgColor(this.data.logo1, appLogin.globalData.themeColor),

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
  bindHideToast() {
    this.setData({
      errorText: ''
    })
  },
  tapDialogButton() {
    this.setData({
      showSingleStop: false
    });
  },
  radioChange(e: any) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var checked = this.data.checked;
    this.setData({
      "checked": !checked
    });
  },
  isAgree() {
    if (!this.data.checked) {
      util.showErrorToast('请先阅读用户注册协议')
    }
  },
  goProtocol(e: any) {
    console.log('1111', e, this.data.protocol);
    var index = e.currentTarget.dataset.index;
    // var content = this.data.protocol[index]['content'];
    // console.log('12345====', content);
    wx.navigateTo({
      url: '/packageOne/pages/protocol/protocol?index=' + index
    })
  },

  //getphone
  getPhoneNumber(e: any) {
    let self = this;
    self.setData({
      showPhoneDialog1: false,
      showPhoneDialog2: false,
    })
    console.log('获取手机号码====', e);
    if (!this.data.checked) {
      util.showErrorToast('请先阅读用户注册协议')
    } else {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        self.setData({
          showPhoneDialog1: false,
          showPhoneDialog2: false,
        })
        wx.login({
          success: (res) => {
            console.log(res)
            if (res.code) {
              //确认
              var userSIngleInfo = JSON.parse(wx.getStorageSync('permisssion').rawData);
              util.request(api.AuthLoginByWeixin, { nickname: userSIngleInfo.nickName, avatar: userSIngleInfo.avatarUrl, wechatPhoneCode: e.detail.code, loginType: 2, wechatCode: res.code }
                , 'POST').then(function (res: any) {
                  if (res && res.data.accessToken) {
                    console.log(res)
                    wx.setStorageSync("cookie", res.data.accessToken);
                    wx.setStorageSync("currentUserInfo", res.data.currentUserInfo);
                    wx.setStorageSync("userSign", res.data.userSign);
                    util.getThemeColor({ shopId: wx.getStorageSync('shopId'), openId: wx.getStorageSync('openId') }).then((res: any) => {
                      wx.setStorageSync('themeColor', res.data.primaryColor);
                      appLogin.globalData.themeColor = res.data.primaryColor;
                      self.getShopAndUserInfo();
                    })
                    // 绑定分享人
                    util.bindShareUser()
                  }
                }).catch((error: any) => {
                    console.log('11111===',error);
                    if (error.data.errorCode == '100025') {
                        self.setData({
                        showSingleStop: true,
                      })
                    } else if (error.data.errorCode == '100024') {
                        self.setData({
                        showPhoneDialog2: true,
                      })
                    } else if (error.data.errorCode == '100034' || error.data.errorCode == '100018') {
                        self.setData({
                        errorText: error.data.errMessage,
                      })
                    }
                });
            }
          }
        })
      } else {
        if (e.detail.errMsg === 'getPhoneNumber:fail user deny' || e.detail.errMsg === 'getPhoneNumber:fail:user deny') {
          wx.showModal({
            title: '提示',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
            showCancel: false,
            confirmText: '返回授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击了“返回授权”');
              }
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '小程序主体企业未完成微信认证，无法授权获取手机号',
            showCancel: false,
            confirmText: '确定'
          });
        }

      }

    }

  },
  goOtherLogin() {
    if (!this.data.checked) {
      util.showErrorToast('请先阅读用户注册协议')
    } else {
      wx.navigateTo({
        url: '/packageOne/pages/phoneLogin/index'
      })
    }
  },
  goLogin() {
    let code = '';
    let _that = this;
    var userSIngleInfo = JSON.parse(wx.getStorageSync('permisssion').rawData);
    if (!this.data.checked) {
      util.showErrorToast('请同意用户注册协议')
    } else {
      if (this.data.isNewUser == "true") {
        this.setData({
          showPhoneDialog1: true,
        })
      } else {
          if(this.data.submitAccess){
            _that.setData({
                submitAccess:false,
            })
        wx.login({
          success: (res) => {
            code = res.code;
            if (code) {
              util.request(api.AuthLoginByWeixin, { nickname: userSIngleInfo.nickName, avatar: userSIngleInfo.avatarUrl, wechatCode: code, loginType: 2, wechatToken: wx.getStorageSync('token') }
                , 'POST').then(function (res: any) {
                  console.log('不获取手机号码的直接登录====', res);
                  if (res && res.data.accessToken) {
                    wx.setStorageSync("cookie", res.data.accessToken);
                    wx.setStorageSync("currentUserInfo", res.data.currentUserInfo);
                    wx.setStorageSync("userSign", res.data.userSign);
                    util.bindShareUser();
                    _that.getH5token();
                    wx.getStorageSync("registerLogin") && wx.removeStorageSync("registerLogin");
                    util.getThemeColor({ shopId: wx.getStorageSync('shopId'), openId: wx.getStorageSync('openId') }).then((res: any) => {
                      wx.setStorageSync('themeColor', res.data.primaryColor);
                      appLogin.globalData.themeColor = res.data.primaryColor
                      _that.getShopAndUserInfo();
                    });
                  }
                }).catch((error: any) => {
                    console.log('11111===',error);
                  if (error.data.errorCode == '100025') {
                    _that.setData({
                      showSingleStop: true,
                    })
                  } else if (error.data.errorCode == '100024') {
                    _that.setData({
                      showPhoneDialog2: true,
                    })
                  } else if (error.data.errorCode == '100034' || error.data.errorCode == '100018') {
                    _that.setData({
                      errorText: error.data.errMessage,
                    })
                  }
                });
            }
          },
        });
        setTimeout(()=>{
            this.setData({
                submitAccess:true,
            })
        },2500)
    }

      }
    }
  },
  closeDialog() {
    this.setData({
      showPhoneDialog1: false,
      showPhoneDialog2: false
    });
  },
  //获取商城token
  getH5token() {
    //拿到商城的token
    // + '?shar_key=' + wx.getStorageSync('shar_key')
    // +'?shar_key=1d887e2b3bb38565'
    util.request(api.getH5Token).then(function (res: any) {
      if (res && res.data) {
        console.log('shar_key====', res.data);
        wx.setStorageSync("access_token", res.data.nuskinToken);
        wx.setStorageSync("nuskinToken", res.data.shopToken.access_token);
      }
    });
  },
  getShopAndUserInfo() {
    //todo 回到上一个页面
    let _that = this;
    util.request(api.getUserInfo).then(function (res: any) {
      console.log('获取个人信息信息====', res);
      if (res && res.data.user) {
        wx.setStorageSync('userInfo', Object.assign({}, res.data.user, res.data.userProfile, res.data.nuskinUserInfo));
        util.showOtherToast('登录成功', 'success');
        if (imClient.connected) {
          imClient.disconnect();
        }
        const imInfo = { userID: wx.getStorageSync("currentUserInfo").uid, userSig: wx.getStorageSync("userSign") }
        imClient.connect(imInfo);
        getApp().sensors.track('LoginResult', {
          account: res.data.user.mobile,
          get_type: '微信',
          is_quick_login: 1
        });
        getApp().sensors.registerApp({
          account_id: res.data.user.nkMemberId,
          user_style: '注册顾客',
          is_login: 1
        });
        getApp().sensors.login(res.data.user.accountId);
        if (res && res.data.userShopInfo && res.data.userShopInfo.shop && res.data.userShopInfo.shop.id) {
          res.data.userShopInfo.shop.id && wx.setStorageSync('shopInfo', res.data.userShopInfo);
        }
        setTimeout(() => {
          if (wx.getStorageSync('h5')) {
            util.backAddress(2);
          } else {
            util.backAddress(0);
          }

          _that.saveProtocol();
        }, 1500)
      }
    });
  },
  //同意用户注册协议
  saveProtocol() {
    // console.log('同意用户协议');
    util.request(api.saveProtocols, { agreeEmp: "4", memberId: wx.getStorageSync('userInfo').nkMemberId, termsId: wx.getStorageSync('userProtocolInfo').id, typeId: wx.getStorageSync('userProtocolInfo').typeId }, 'POST').then(() => {
    });
  }
})